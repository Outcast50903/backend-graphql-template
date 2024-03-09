const uri = [
  'postgres://',
  process.env.POSTGRES_USER,
  ':',
  process.env.POSTGRES_PASSWORD,
  '@db.localtest.me:5432/',
  process.env.POSTGRES_DB,
  '?sslmode=require',
].join('');

export default () => ({
  database_url:
    process.env.NODE_ENV === 'development' ? uri : process.env.DATABASE_URL,
});
