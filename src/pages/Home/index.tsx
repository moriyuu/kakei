import Home from "./Home";
import { Auth } from "../../components/Auth";

const Container = () => {
  return (
    <Auth>
      <Home />
    </Auth>
  );
};

export default Container;
