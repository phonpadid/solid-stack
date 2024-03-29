import { A } from "@solidjs/router";
import logo from "../../../assets/log_halpay.png";

export default function () {
  return (
    <A href="/" class="flex items-center justify-between mr-4">
      <img src={logo} class="mr-3 h-8" alt="Flowbite Logo" />
      <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
        HAL PAY
      </span>
    </A>
  );
}
