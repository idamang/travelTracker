import * as commentService from '../services/commentService';

export const getCommentsByCountryId = async ({ countryId }: { countryId: number }, context: {userId: number}) => {
    return await commentService.getCommentsByCountryId(countryId, context.userId);
};

export const getCommentById = async ({ id }: { id: number }) => {
    return await commentService.getCommentById(id);
};

export const createComment = async ({ countryId, text }: { countryId: number; text: string }, context: { userId: number }) => {
    if (!context.userId) {
        throw new Error("Unauthorized access - No user logged in");
    }
    return await commentService.createComment(context.userId, countryId, text);
};

export const updateComment = async ({ id, text }: { id: number; text: string }, context: { userId: number }) => {
    if (!context.userId) {
        throw new Error("Unauthorized access - No user logged in");
    }
    return await commentService.updateComment(id, context.userId, text);
};

export const deleteComment = async ({ id }: { id: number }, context: { userId: number }) => {
    if (!context.userId) {
        throw new Error("Unauthorized access - No user logged in");
    }
    return await commentService.deleteComment(id, context.userId);
};