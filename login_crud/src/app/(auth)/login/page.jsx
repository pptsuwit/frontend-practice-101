"use client";
import { useEffect } from "react";

import { authService } from "@/services/auth.service";
import httpService from "@/utils/axios";

import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";

import { message } from "antd";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/zodSchema/loginSchema";
import Input from "@/components/Input";
export default function page() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (getCookie(process.env.TOKEN_NAME) !== undefined) {
      router.replace("/");
    }
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  async function onSubmit(data) {
    try {
      await authService.login(data.email, data.password).then(async (item) => {
        const { token, user } = item.data;
        if (token) {
          setCookie(process.env.TOKEN_NAME, token);
          httpService.defaults.headers.common[
            "authorization"
          ] = `Bearer ${token}`;
          localStorage.setItem("user", JSON.stringify(user));
          router.replace("/");
        }
      });
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error,
      });
    }
  }

  return (
    <>
      {contextHolder}
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white border border-gray-200 shadow-lg p-8 rounded-lg w-full sm:w-96">
          <h1 className="text-5xl text-center text-blue-600 font-semibold mb-6">
            Welcome
          </h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-md font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="text"
                placeholder="Email"
                register={register("email", { required: true })}
                errors={errors}
              ></Input>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-md font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                register={register("password", { required: true })}
                errors={errors}
              ></Input>
            </div>
            <div className="mb-4 ">
              <button
                className="w-full focus:border-blue-400 focus:border-2 shadow
              bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                Login
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 font-bold">
              Don't have an account?{" "}
              <a href="/register" className="text-indigo-500 hover:underline">
                Register
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
