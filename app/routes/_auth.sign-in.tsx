import { MetaFunction } from "@remix-run/node";
import { SignInScreen } from "@/screens/sign-in";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Sign In",
    },
  ];
};

export default SignInScreen;
