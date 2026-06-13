import { useState, useCallback } from "react";
import { PaymentMethod } from "../types";

interface PaymentModalProps {
  isOpen: boolean;
  total: number;
  onClose: () => void;
  onComplete: () => void;
}

const paymentMethods: { id: PaymentMethod; icon: string; label: string }[] = [
  { id: "cash", icon: "payments", label: "Cash" },
  { id: "qris", icon: "qr_code_2", label: "QRIS" },
  { id: "bank", icon: "account_balance", label: "Bank Transfer" },
  { id: "debit", icon: "credit_card", label: "Debit Card" },
];

export default function PaymentModal({
  isOpen,
  total,
  onClose,
  onComplete,
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("cash");
  const [amountReceived, setAmountReceived] = useState("0");

  const handleNumpad = useCallback((val: string | number) => {
    if (val === "clear") {
      setAmountReceived("0");
    } else if (val === "del") {
      setAmountReceived((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
    } else {
      setAmountReceived((prev) =>
        prev === "0" ? val.toString() : prev + val.toString()
      );
    }
  }, []);

  const amountNum = parseFloat(amountReceived) || 0;
  const changeDue = Math.max(0, amountNum - total);

  const handleComplete = () => {
    onComplete();
    setAmountReceived("0");
    setSelectedMethod("cash");
  };

  const handleClose = () => {
    onClose();
    setAmountReceived("0");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm flex items-center justify-center">
      <div className="bg-surface-container-lowest w-[800px] max-w-[90%] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-outline-variant flex justify-between items-center">
          <h2 className="font-semibold text-3xl leading-10 text-primary">
            Process Payment
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex flex-1 min-h-[500px]">
          {/* Payment Methods */}
          <div className="w-1/3 border-r border-outline-variant p-4 bg-surface-container-low space-y-4">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full p-6 rounded border border-outline-variant bg-surface flex items-center gap-4 font-semibold text-sm tracking-wide transition-all active:scale-95 ${
                  selectedMethod === method.id
                    ? "bg-secondary-fixed text-primary border-primary"
                    : "text-on-surface-variant hover:border-primary"
                }`}
              >
                <span className="material-symbols-outlined">
                  {method.icon}
                </span>
                {method.label}
              </button>
            ))}
          </div>

          {/* Cash Numpad Area */}
          <div className="flex-1 p-6 flex flex-col">
            <div className="flex flex-col gap-3 mb-6">
              <label className="font-medium text-xs uppercase tracking-wide text-on-surface-variant">
                Amount Received
              </label>
              <div className="text-3xl leading-10 font-medium text-sm text-right border-b-2 border-primary py-2 font-mono">
                {amountNum.toFixed(2)}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 flex-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleNumpad(num)}
                  className="bg-surface-container-high font-semibold text-2xl leading-8 rounded py-4 hover:bg-surface-container-highest active:scale-95 transition-all"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => handleNumpad("clear")}
                className="bg-error-container text-on-error-container font-semibold text-sm tracking-wide rounded py-4 hover:opacity-90 active:scale-95 transition-all"
              >
                CLR
              </button>
              <button
                onClick={() => handleNumpad(0)}
                className="bg-surface-container-high font-semibold text-2xl leading-8 rounded py-4 hover:bg-surface-container-highest active:scale-95 transition-all"
              >
                0
              </button>
              <button
                onClick={() => handleNumpad("del")}
                className="bg-surface-container-high font-semibold text-2xl leading-8 rounded py-4 hover:bg-surface-container-highest active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined">backspace</span>
              </button>
            </div>

            <div className="mt-6 p-4 bg-secondary-fixed rounded flex justify-between items-center">
              <span className="font-semibold text-sm tracking-wide text-on-secondary-fixed">
                Change Due:
              </span>
              <span className="font-semibold text-2xl leading-8 text-primary">
                ${changeDue.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-outline-variant bg-surface flex gap-4">
          <button
            onClick={handleClose}
            className="flex-1 border border-outline text-on-surface-variant font-semibold text-sm tracking-wide py-4 rounded hover:bg-surface-container-low transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={handleComplete}
            className="flex-[2] bg-primary text-on-primary font-semibold text-2xl leading-8 py-4 rounded hover:opacity-90 active:scale-95 transition-all"
          >
            COMPLETE TRANSACTION
          </button>
        </div>
      </div>
    </div>
  );
}
