type props = {
  title: string;
}
const About = (props: props) => {
  return <div style="background: skyblue;height: 500px;">{props.title}</div>;
};

About.props = ['title'];

export default About;

