import db from '../db';

/**
 * Fetches all comments for a given country
 * @param countryId The id of the country to fetch comments for
 * @returns A list of comments for the given country
 */
export const getCommentsByCountryId = async (countryId: number, userId?: number) => {
    try {
      const comments = await db.Comment.findAll({
        where: {
          country_id: countryId,
        },
        include: [
          {
            model: db.User,
            as: 'user',
            attributes: ['id', 'name'],
          },
        ],
      });
  
      return comments.map(comment => ({
        ...comment.toJSON(),
        editable: userId ? comment.user_id === userId : false, // Set editable to false if userId is null/undefined
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw new Error('Failed to fetch comments');
    }
};
  

/**
 * Fetches a comment by its id
 * @param id The id of the comment to fetch
 * @returns The comment with the given id
 */
export const getCommentById = async (id: number) => {
  return await db.Comment.findByPk(id);
}

/**
 * Creates a new comment
 * @param userId The id of the user creating the comment
 * @param countryId The id of the country the comment is about
 * @param text The text of the comment
 * @returns The newly created comment
 */
export const createComment = async (userId: number, countryId: number, text: string) => {
  return await db.Comment.create({
    user_id: userId,
    country_id: countryId,
    text: text,
  });
}

/**
 * Updates a comment
 * @param id The id of the comment to update
 * @param text The new text of the comment
 * @param userId The id of the user updating the comment
 * @returns The updated comment
 * @throws An error if the comment does not exist
 * @throws An error if the user is not the author of the comment
 */
export const updateComment = async (id: number, userId: number, text: string) => {
    const comment = await db.Comment.findByPk(id, {
        include: [
          {
            model: db.User,
            as: 'user',
            attributes: ['id', 'name'],
          },
        ],
    });
    if (!comment) {
        throw new Error('Comment not found');
    }
    if (comment.user_id !== userId) {
        throw new Error('Unauthorized access - User is not the author of the comment');
    }
    comment.text = text;
    await comment.save();

    // Return the updated comment with editable information
    return {
        ...comment.toJSON(),
        editable: comment.user_id === userId,
    };
}

/**
 * Deletes a comment
 * @param id The id of the comment to delete
 * @param userId The id of the user deleting the comment
 * @throws An error if the comment does not exist
 * @throws An error if the user is not the author of the comment
 * @returns True if the comment was successfully deleted
 */
export const deleteComment = async (id: number, userId: number) => {
    const comment = await db.Comment.findByPk(id);
    if (!comment) {
        throw new Error('Comment not found');
    }
    if (comment.user_id !== userId) {
        throw new Error('Unauthorized access - User is not the author of the comment');
    }
    await comment.destroy();
    return true;
}
