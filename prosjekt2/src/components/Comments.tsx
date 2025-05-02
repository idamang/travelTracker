import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { useState } from 'react';
import { useMutation, useQuery, Reference } from '@apollo/client';
import { GET_COMMENTS_BY_COUNTRY_ID } from '@/service/queries';
import {
  CREATE_COMMENT,
  DELETE_COMMENT,
  UPDATE_COMMENT,
} from '@/service/mutations';
import { Comment, User } from '@/service/types';

interface CommentThreadProps {
  countryId: number;
  user?: User;
}

export default function CommentThread({ countryId, user }: CommentThreadProps) {
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editedCommentText, setEditedCommentText] = useState('');

  // GraphQL hooks
  const { data, loading, error } = useQuery(GET_COMMENTS_BY_COUNTRY_ID, {
    variables: { countryId },
    fetchPolicy: 'cache-and-network',
  });

  const [createComment] = useMutation(CREATE_COMMENT, {
    update: (cache, { data: mutationData }) => {
      const newComment = mutationData?.createComment;
      if (newComment) {
        const existingData = cache.readQuery<{
          getCommentsByCountryId: Comment[];
        }>({
          query: GET_COMMENTS_BY_COUNTRY_ID,
          variables: { countryId },
        });

        if (existingData) {
          cache.writeQuery({
            query: GET_COMMENTS_BY_COUNTRY_ID,
            variables: { countryId },
            data: {
              getCommentsByCountryId: [
                ...existingData.getCommentsByCountryId,
                newComment,
              ],
            },
          });
        }
      }
    },
  });

  const [updateComment] = useMutation(UPDATE_COMMENT, {
    update: (cache, { data: mutationData }) => {
      const updatedComment = mutationData?.updateComment;
      if (updatedComment) {
        const existingData = cache.readQuery<{
          getCommentsByCountryId: Comment[];
        }>({
          query: GET_COMMENTS_BY_COUNTRY_ID,
          variables: { countryId },
        });

        if (existingData) {
          cache.writeQuery({
            query: GET_COMMENTS_BY_COUNTRY_ID,
            variables: { countryId },
            data: {
              getCommentsByCountryId: existingData.getCommentsByCountryId.map(
                (comment) =>
                  comment.id === updatedComment.id ? updatedComment : comment
              ),
            },
          });
        }
      }
    },
  });

  const [deleteComment] = useMutation(DELETE_COMMENT, {
    update: (cache, _, { variables }) => {
      const deletedCommentId = variables?.id;
      if (deletedCommentId) {
        cache.modify({
          fields: {
            getCommentsByCountryId(
              existingComments: readonly Reference[] = []
            ) {
              return existingComments.filter(
                (comment: Reference) =>
                  comment.__ref !== `Comment:${deletedCommentId}`
              );
            },
          },
        });
      }
    },
  });

  // Handle posting a new comment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      await createComment({
        variables: { countryId, text: newComment },
      });
      setNewComment('');
    }
  };

  // Handle editing a comment
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingComment && editedCommentText.trim()) {
      await updateComment({
        variables: { id: editingComment.id, text: editedCommentText },
      });
      setEditingComment(null); // Exit editing mode after saving
    }
  };

  // Handle deleting a comment
  const handleDelete = async (id: number) => {
    await deleteComment({ variables: { id } });
  };

  const comments = data?.getCommentsByCountryId || [];

  return (
    <Card className="w-full mx-auto m:max-w-xs mt-6">
      <CardHeader>
        <h2 className="text-2xl font-bold">Comments</h2>
      </CardHeader>
      <CardContent>
        {loading && <p>Loading comments...</p>}
        {error && <p>Error loading comments.</p>}
        {!loading && !error && (
          <ScrollArea className="pr-4">
            {comments.map((comment: Comment) => (
              <div key={comment.id} className="flex space-x-4 mb-4">
                <Avatar>
                  <AvatarImage
                    src="?height=40&width=40"
                    alt={comment.user?.name || 'User'}
                  />
                  <AvatarFallback>
                    {comment.user?.name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{comment.user?.name}</h3>
                    <span className="text-sm text-muted-foreground">
                      {comment.created_at
                        ? new Date(Number(comment.created_at)).toLocaleString()
                        : 'Unknown'}
                    </span>
                  </div>
                  {editingComment?.id === comment.id ? (
                    <form onSubmit={handleEditSubmit}>
                      <Textarea
                        value={editedCommentText}
                        onChange={(e) => setEditedCommentText(e.target.value)}
                        className="w-full mt-2"
                      />
                      <div className="flex space-x-2 mt-2">
                        <Button type="submit">Save</Button>
                        <Button
                          type="button"
                          onClick={() => setEditingComment(null)}
                          variant="secondary"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <p className="mt-1">{comment.text}</p>
                  )}
                  {comment.editable && (
                    <div className="flex space-x-2 mt-2">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setEditingComment(comment);
                          setEditedCommentText(comment.text);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(comment.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>
        )}
      </CardContent>
      <CardFooter>
        {user ? (
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full"
            />
            <Button type="submit">Post Comment</Button>
          </form>
        ) : (
          <p className="text-sm text-muted-foreground">Log in to comment</p>
        )}
      </CardFooter>
    </Card>
  );
}
