type props = {
  title: string;
}
const Home = (props: props) => {
  return <div style="background: pink;height: 500px;">{props.title}</div>;
};

Home.props = ['title'];

export default Home;

