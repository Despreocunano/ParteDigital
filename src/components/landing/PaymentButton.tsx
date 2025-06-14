import { useState } from 'react';
import { Button } from '../ui/Button';
import { PaymentModal } from '../ui/PaymentModal';
import { Lock } from 'lucide-react';

interface PaymentButtonProps {
  onSuccess: () => void;
  amount: number;
  description: string;
  paymentType: string;
  buttonText: string;
  isPaid?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function PaymentButton({
  onSuccess,
  amount,
  description,
  paymentType,
  buttonText,
  isPaid = false,
  icon = <Lock className="h-4 w-4" />,
  className = ''
}: PaymentButtonProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleClick = () => {
    if (isPaid) {
      onSuccess();
    } else {
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    onSuccess();
  };

  return (
    <>
      <Button
        onClick={handleClick}
        leftIcon={isPaid ? null : icon}
        className={className}
      >
        {isPaid ? buttonText : `${buttonText} ($${amount.toLocaleString('es-CL')})`}
      </Button>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
        amount={amount}
        description={description}
        paymentType={paymentType}
      />
    </>
  );
}