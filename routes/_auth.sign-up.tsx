import { MetaFunction } from "@remix-run/node";
import { SignUpScreen } from "@/auth/sign-up";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Sign Up",
    },
  ];
};

export default SignUpScreen;
