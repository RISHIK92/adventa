"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";

const exams = [
  {
    id: "jee",
    name: "JEE",
    description: "Engineering Entrance",
    avatarUrl:
      "https://res.cloudinary.com/dtclu3fmc/image/upload/v1757521351/byel99j9ynixtbnjb943.png",
  },
  {
    id: "neet",
    name: "NEET",
    description: "Medical Entrance",
    avatarUrl:
      "https://res.cloudinary.com/dtclu3fmc/image/upload/v1757521360/prpmzg5qn27tie585uhv.png",
  },
  //   {
  //     id: "upsc",
  //     name: "UPSC",
  //     description: "Civil Services",
  //     avatarUrl:
  //       "https://res.cloudinary.com/dtclu3fmc/image/upload/v1757521364/ayjoftupvvehvhb9s7va.png",
  //   },
  //   {
  //     id: "cat",
  //     name: "CAT",
  //     description: "Management",
  //     avatarUrl:
  //       "https://res.cloudinary.com/dtclu3fmc/image/upload/v1757521372/ietf7n4czkgnyampkk7w.png",
  //   },
  //   {
  //     id: "gate",
  //     name: "GATE",
  //     description: "Graduate Aptitude",
  //     avatarUrl:
  //       "https://res.cloudinary.com/dtclu3fmc/image/upload/v1757521487/plfybblzhaq9bsj3mxxp.png",
  //   },
  {
    id: "bitsat",
    name: "BITSAT",
    description: "Entrance to Bits Institutions",
    avatarUrl:
      "https://res.cloudinary.com/dtclu3fmc/image/upload/v1757582248/Generated_Image_September_11_2025_-_2_46PM_nrzwis.png",
  },
  {
    id: "viteee",
    name: "VITEEE",
    description: "Entrance to Vit Institutions",
    avatarUrl:
      "https://res.cloudinary.com/dtclu3fmc/image/upload/v1757585453/Generated_Image_September_11_2025_-_3_05PM_jmsjj0.png",
  },
  {
    id: "eamcet",
    name: "EAMCET",
    description: "Eamcet",
    avatarUrl:
      "https://res.cloudinary.com/dtclu3fmc/image/upload/v1757582580/vmmedbhay3txt00zjxor.png",
  },
];

export default function ExamSelector() {
  const [selectedExam, setSelectedExam] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleSelectExam = (exam) => {
    setIsSelecting(true);
    setSelectedExam(exam);

    setTimeout(() => {
      localStorage.setItem("selected-exam", exam.name);
      const existing = JSON.parse(
        localStorage.getItem("onboarding-data") || "{}"
      );
      localStorage.setItem(
        "onboarding-data",
        JSON.stringify({ ...existing, examName: exam.name })
      );

      if (!localStorage.getItem("onboarding-completed")) {
        localStorage.setItem("onboarding-completed", "true");
      }

      // In real app, use router.push("/")
      alert(`Welcome to your ${exam.name} journey!`);
      setIsSelecting(false);
    }, 1000);
  };

  const handleAddProfile = () => {
    alert("Contact support to add more exam profiles");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-normal text-gray-900 mb-4">
            Pick Your Exam Adventure
          </h1>
        </div>

        {/* Profile Grid */}
        <div className="flex justify-center">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 max-w-5xl">
            {exams.map((exam) => (
              <motion.div
                key={exam.id}
                className="flex flex-col items-center cursor-pointer group"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleSelectExam(exam)}
              >
                <div className="relative mb-4">
                  <div className="w-48 h-48 rounded-lg overflow-hidden bg-gray-100 border-4 border-transparent group-hover:border-gray-300 transition-all duration-200">
                    <img
                      src={exam.avatarUrl}
                      alt={exam.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {selectedExam?.id === exam.id && isSelecting && (
                    <div className="absolute inset-0 bg-white bg-opacity-90 rounded-lg flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <h3 className="text-gray-600 font-normal text-lg group-hover:text-gray-900 transition-colors">
                    {exam.name}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {exam.description}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Add Profile Button */}
            {/* <motion.div
              className="flex flex-col items-center cursor-pointer group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={handleAddProfile}
            >
              <div className="w-32 h-32 rounded-lg bg-gray-100 border-4 border-transparent group-hover:border-gray-300 transition-all duration-200 flex items-center justify-center mb-4">
                <Plus className="w-12 h-12 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>

              <div className="text-center">
                <h3 className="text-gray-600 font-normal text-lg group-hover:text-gray-900 transition-colors">
                  Add Exam
                </h3>
                <p className="text-gray-400 text-sm mt-1">Request new exam</p>
              </div>
            </motion.div> */}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <Button
            variant="outline"
            className="border-2 border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-900 px-8 py-2 text-base font-normal"
          >
            MANAGE EXAMS
          </Button>
        </div>
      </div>
    </div>
  );
}
