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
  { id: "bank", icon: "account_balance", label: "Bank" },
  { id: "debit", icon: "credit_card", label: "Debit" },
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
    <div className="fixed inset-0 bg-black/50 z-[200] backdrop-blur-sm flex items-end lg:items-center justify-center fade-in">
      <div className="bg-surface-container-lowest w-full lg:w-[800px] lg:max-w-[90%] rounded-t-2xl lg:rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] lg:max-h-[90vh] slide-up lg:animate-none">
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-outline-variant flex justify-between items-center flex-shrink-0">
          <h2 className="font-semibold text-xl lg:text-3xl leading-8 lg:leading-10 text-primary">
            Process Payment
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content - stacked on mobile, side-by-side on desktop */}
        <div className="flex flex-col lg:flex-row flex-1 min-h-0 lg:min-h-[500px] overflow-y-auto lg:overflow-visible">
          {/* Payment Methods - horizontal scroll on mobile, vertical on desktop */}
          <div className="lg:w-1/3 border-b lg:border-b-0 lg:border-r border-outline-variant p-3 lg:p-4 bg-surface-container-low flex-shrink-0">
            <div className="flex lg:flex-col gap-2 lg:gap-4 overflow-x-auto hide-scrollbar">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`flex-shrink-0 p-3 lg:p-6 rounded border border-outline-variant bg-surface flex items-center gap-2 lg:gap-4 font-semibold text-xs lg:text-sm tracking-wide transition-all active:scale-95 lg:w-full ${
                    selectedMethod === method.id
                      ? "bg-secondary-fixed text-primary border-primary"
                      : "text-on-surface-variant hover:border-primary"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] lg:text-[24px]">
                    {method.icon}
                  </span>
                  <span className="whitespace-nowrap">{method.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cash Numpad Area */}
          <div className="flex-1 p-3 lg:p-6 flex flex-col min-h-0">
            {/* Amount display */}
            <div className="flex flex-col gap-1 lg:gap-3 mb-3 lg:mb-6 flex-shrink-0">
              <div className="flex items-center justify-between">
                <label className="font-medium text-[10px] lg:text-xs uppercase tracking-wide text-on-surface-variant">
                  Amount Received
                </label>
                <span className="text-xs text-on-surface-variant lg:hidden">
                  Total: ${total.toFixed(2)}
                </span>
              </div>
              <div className="text-2xl lg:text-3xl leading-8 lg:leading-10 font-semibold text-right border-b-2 border-primary py-1 lg:py-2 font-mono tabular-nums">
                {amountNum.toFixed(2)}
              </div>
            </div>

            {/* Numpad Grid */}
            <div className="grid grid-cols-3 gap-2 lg:gap-3 flex-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleNumpad(num)}
                  className="bg-surface-container-high font-semibold text-xl lg:text-2xl leading-8 rounded py-3 lg:py-4 hover:bg-surface-container-highest active:scale-95 transition-all"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => handleNumpad("clear")}
                className="bg-error-container text-on-error-container font-semibold text-xs lg:text-sm tracking-wide rounded py-3 lg:py-4 hover:opacity-90 active:scale-95 transition-all"
              >
                CLR
              </button>
              <button
                onClick={() => handleNumpad(0)}
                className="bg-surface-container-high font-semibold text-xl lg:text-2xl leading-8 rounded py-3 lg:py-4 hover:bg-surface-container-highest active:scale-95 transition-all"
              >
                0
              </button>
              <button
                onClick={() => handleNumpad("del")}
                className="bg-surface-container-high font-semibold text-xl lg:text-2xl leading-8 rounded py-3 lg:py-4 hover:bg-surface-container-highest active:scale-95 transition-all flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[20px] lg:text-[24px]">
                  backspace
                </span>
              </button>
            </div>

            {/* Change Due */}
            <div className="mt-3 lg:mt-6 p-3 lg:p-4 bg-secondary-fixed rounded flex justify-between items-center flex-shrink-0">
              <span className="font-semibold text-xs lg:text-sm tracking-wide text-on-secondary-fixed">
                Change Due:
              </span>
              <span className="font-semibold text-xl lg:text-2xl leading-8 text-primary">
                ${changeDue.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 lg:p-6 border-t border-outline-variant bg-surface flex gap-2 lg:gap-4 flex-shrink-0">
          <button
            onClick={handleClose}
            className="flex-1 border border-outline text-on-surface-variant font-semibold text-xs lg:text-sm tracking-wide py-3 lg:py-4 rounded hover:bg-surface-container-low transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={handleComplete}
            className="flex-[2] bg-primary text-on-primary font-semibold text-sm lg:text-2xl lg:leading-8 py-3 lg:py-4 rounded hover:opacity-90 active:scale-95 transition-all"
          >
            COMPLETE
          </button>
        </div>
      </div>
    </div>
  );
}
