import { useRouter } from "next/router";
import * as firebase from "../../lib/firebase";

const SignIn = () => {
  const router = useRouter();

  const user = firebase.getCurrentUser();
  if (user) {
    // TODO:
    console.log("user redirect?!", user);
    router.push("/");
  }

  console.log("render signIn");

  return (
    <div>
      <button onClick={firebase.signIn}>signIn</button>
      <button onClick={firebase.signOut}>signOut</button>
    </div>
  );
};

export default SignIn;
