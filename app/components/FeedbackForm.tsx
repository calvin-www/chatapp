"use client";
import React, { useState, ChangeEvent } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  Slider,
} from "@nextui-org/react";
import { auth } from "@/app/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { saveFeedback } from "@/app/utils/firestore";

interface FeedbackFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: { rating: number; comment: string }) => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [user] = useAuthState(auth);
  const [rating, setRating] = useState<number>(3);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    if (user) {
      try {
        await saveFeedback({
          userId: user.uid,
          name: user.displayName || "Anonymous",
          rating,
          comment,
          timestamp: new Date(),
        });
        onSubmit({ rating, comment });
        onClose();
      } catch (error) {
        console.error("Error saving feedback:", error);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      classNames={{
        base: "bg-gray-800 text-gray-100",
        header: "border-b border-gray-700",
        body: "py-6",
        footer: "border-t border-gray-700",
      }}
    >
      <ModalContent>
        <ModalHeader>
          <h3 className="text-cyan-400">Provide Feedback</h3>
        </ModalHeader>
        <ModalBody>
          <div className="mb-4">
            <p className="mb-2 text-cyan-400">Rate your experience</p>
            <div className="flex items-center">
              <Slider
                showSteps={true}
                step={1}
                minValue={0}
                maxValue={5}
                value={rating}
                onChange={(value) => setRating(value as number)}
                className="max-w-md mr-4"
                color="primary"
              />
              <span className="text-cyan-400 font-bold">{rating}</span>
            </div>
          </div>
          <Textarea
            label="Additional comments"
            placeholder="Enter your feedback here"
            value={comment}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setComment(e.target.value)
            }
            className="bg-gray-700 text-gray-100"
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="light"
            onPress={onClose}
            className="bg-gray-700 text-red-400 hover:bg-gray-600"
          >
            Close
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            className="bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-500 hover:from-blue-500 hover:via-cyan-500 hover:to-blue-600 text-white"
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FeedbackForm;
