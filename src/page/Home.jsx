const Home = () => {
  const month = new Date().getMonth();

  return (
    <div>
      <a href={`/month/${month}`}>Calendar</a>
    </div>
  );
};

export default Home;
