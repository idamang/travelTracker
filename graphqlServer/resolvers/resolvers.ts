import * as userResolvers from './userResolvers';
import * as travelResolvers from './travelResolvers';
import * as mapResolvers from './mapResolvers';
import * as countryResolvers from './countryResolvers';
import * as ratingResolvers from './ratingResolvers';
import * as commentResolvers from './commentResolvers';

const resolvers = {
  ...userResolvers,
  ...travelResolvers,
  ...mapResolvers,
  ...countryResolvers,
  ...ratingResolvers,
  ...commentResolvers,
};

export default resolvers;
