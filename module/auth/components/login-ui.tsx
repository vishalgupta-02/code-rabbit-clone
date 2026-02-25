"use client";

import { signIn } from "@/lib/auth-client";
import { GithubIcon } from "lucide-react";
import { useState } from "react";

const LoginUI = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGithubLogin = async () => {
    setIsLoading(true);
    try {
      await signIn.social({
        provider: "github",
      });
    } catch (error) {
      console.log("Login error", error);
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-linear-to-br from-black via-black to-zinc-900 text-white flex">
      <div className="flex-1 flex flex-col justify-center py-16 px-12">
        <div className="max-w-lg">
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 text-2xl font-bold">
              <div className="w-8 h-8 bg-orange-400 rounded-full"></div>
              <span>CodeMonkey</span>
            </div>
          </div>

          <h1 className="text-5xl font-bold mb-6 leading-tight text-balance">
            Cut Code Review Time & Bugs in Half.{" "}
            <span className="block">Instantly.</span>
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            Supercharge your team to ship faster and better with the most
            advanced AI code reviews.
          </p>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center items-center px-12 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
            <p className="text-gray-400">
              Login using one of the following providers:
            </p>
          </div>
          <button
            onClick={handleGithubLogin}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-white text-black rounded-lg font-semibold hover:bg-orange-200 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3 mb-8 cursor-pointer"
          >
            <GithubIcon size={20} />
            {isLoading ? "Signing in.." : "Github"}
          </button>

          <div className="space-y-4 text-center text-sm text-gray-400">
            <div>
              New to CodeMonkey?
              <a
                href="#"
                className="text-orange-400 hover:text-orange-300 font-semibold"
              >
                Sign Up
              </a>
            </div>
            <div>
              <a
                href="#"
                className="text-orange-400 hover:text-orange-300 font-semibold"
              >
                Self-Hosted Services
              </a>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-700 flex justify-center gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-500">
              Terms of use
            </a>
            <span>and</span>
            <a href="#" className="hover:text-gray-500">
              Privacy policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginUI;
