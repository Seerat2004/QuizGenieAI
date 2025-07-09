import { ToastProvider, ToastViewport } from "./toast";

export function Toaster(props) {
  return (
    <ToastProvider>
      <ToastViewport />
    </ToastProvider>
  );
}