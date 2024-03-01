const Home = () => {
  const month = new Date().getMonth();

  return (
    <div>
      <a href={`/month/${month + 1}`}>Calendar</a>
    </div>
  );
};

export default Home;
