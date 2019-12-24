import userResolver from './users';
import articleResolver from './articles';
import bookmarkResolver from './bookmarks';
import commentResolver from './comments';

const rootResolver = {
  ...userResolver,
  ...articleResolver,
  ...bookmarkResolver,
  ...commentResolver
};

export default rootResolver;
