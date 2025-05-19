import Reactotron from "reactotron-react-native";

Reactotron.configure({
  name: "SpineHub App",
  host: "localhost",
})
  .useReactNative()
  .connect();

export default Reactotron;
