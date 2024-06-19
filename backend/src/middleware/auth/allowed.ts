/*
 * This variable includes all paths and possbily also regex that are excluded from the authentication check of the middleware
 * They are still passed through the middleware to get the userId if required, but no error will be thrown if the user is not logged in.
 * */
const allowedRequests = [
  'question/search',
  'question/trending',
  'question/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(?:/answers|/title|/?)?$',
  'question/create',
  'tags/find',
  'profile/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}',
  'cookie', // This is for development purposes only.
];

export default allowedRequests;
