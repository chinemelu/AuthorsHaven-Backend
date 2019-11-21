import userResolver from './users';
import articleResolver from './articles';

const rootResolver = {
  ...userResolver,
  ...articleResolver
};

export default rootResolver;
