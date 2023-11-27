import { MetaFunction } from "@remix-run/node";
import { SignInScreen } from "@/auth/sign-in";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Sign In",
    },
  ];
};

export default SignInScreen;
