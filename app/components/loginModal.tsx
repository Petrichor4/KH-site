import { Stack, Field, Button, Input } from "@chakra-ui/react";
import CustomModal from "./customModal";
import { signIn } from "next-auth/react";
import { useState, useEffect, FormEvent } from "react";
import { PasswordInput } from "@/components/ui/password-input";

export function LoginModal({onClose}:{onClose: () => void}) {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState("");
  const [logIn, setLogIn] = useState(true);

  useEffect(() => {
    setAlert("");
  }, [logIn]);

  console.log(loading);
  console.log(alert);

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");
    const passwordConfirm = formData.get("password-confirm");

    if (password !== passwordConfirm) {
      setAlert("Passwords must match");
      setLoading(false);
      return;
    }

    if (!username || !password || !passwordConfirm) {
      setAlert("Please fill in all fields");
      setLoading(false);
      return;
    }

    await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    console.log("username length:", username.toString().length);
    setAlert("account created succesfully!");
    setLoading(false);
    setLogIn(true);
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    console.log(username, password);

    if (!username || !password) {
      setAlert("Please finish the form");
      setLoading(false);
      return;
    }

    try {
      const response = await signIn("credentials", {
        username: username,
        password: password,
        callbackUrl: "/",
        redirect: false,
      });
      if (response?.error) {
        setAlert("error validating");
        return;
      }
      console.log(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <>
      <CustomModal isOpen={true} onClose={onClose} title="">
        {logIn ? (
          <form
            onSubmit={handleLogin}
            className="w-full h-fit sm:min-w-[355px] sm:min-h-[400px] bg-white p-4 rounded-xl flex justify-around items-center flex-col relative text-black"
          >
            <Stack gap={8} className="w-full md:w-2/3 mb-8">
              <h2 className="text-3xl text-center">Sign in</h2>
              <Field.Root invalid={!!alert}>
                <Field.Label fontSize={"xl"}>Username</Field.Label>
                <Input name="username" />
                <Field.ErrorText>{alert}</Field.ErrorText>
              </Field.Root>
              <Field.Root invalid={!!alert}>
                <Field.Label fontSize={"xl"}>Password</Field.Label>
                <PasswordInput name="password" />
                <Field.ErrorText>{alert}</Field.ErrorText>
              </Field.Root>
              <Button
                type="submit"
                loading={loading}
                loadingText="Signing In"
                className="self-end active:opacity-75 text-xl"
              >
                Sign In
              </Button>
            </Stack>
            <p className="text-xl">
              Dont have an account?{" "}
              <button
                onClick={() => setLogIn(false)}
                type="button"
                className="underline hover:cursor-pointer"
              >
                Create one here
              </button>
            </p>
          </form>
        ) : (
          <form
            onSubmit={handleRegister}
            className="w-full h-fit sm:min-w-[355px] sm:min-h-[400px] bg-white p-4 rounded-xl flex justify-around items-center flex-col relative text-black"
          >
            <Stack gap={8} className="w-full md:w-2/3 mb-8">
              <h2 className="text-3xl text-center">Sign Up</h2>
              <Field.Root invalid={!!alert}>
                <Field.Label fontSize={"xl"}>Username</Field.Label>
                <Input name="username" size={"lg"} fontSize={"lg"} />
                <Field.ErrorText>{alert}</Field.ErrorText>
              </Field.Root>
              <Field.Root invalid={!!alert}>
                <Field.Label fontSize={"xl"}>Password</Field.Label>
                <Input name="password" size={"lg"} fontSize={"lg"} />
                <Field.ErrorText>{alert}</Field.ErrorText>
              </Field.Root>
              <Field.Root invalid={!!alert}>
                <Field.Label fontSize={"xl"}>Confirm Password</Field.Label>
                <Input name="password-confirm" size={"lg"} fontSize={"lg"} />
                <Field.ErrorText>{alert}</Field.ErrorText>
              </Field.Root>
              <Button
                type="submit"
                loading={loading}
                loadingText="Creating account"
                className="self-end active:opacity-75 mb-4 text-xl"
              >
                Sign Up
              </Button>
            </Stack>
            <p className="text-xl">
              Have an account?{" "}
              <button
                onClick={() => setLogIn(true)}
                type="button"
                className="underline hover:cursor-pointer text-black"
              >
                Sign in here
              </button>
            </p>
          </form>
        )}
      </CustomModal>
    </>
  );
}
