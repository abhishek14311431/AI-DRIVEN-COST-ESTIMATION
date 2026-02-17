import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdditionalQuestionsScreen({ onBack, selectedData, onComplete }) {
  const [answers, setAnswers] = useState(selectedData?.answers || {});


  useEffect(() => {
    if (selectedData?.projectType === 'rental-homes') {
      if (selectedData?.plotSize === 'half-site') {
        setAnswers(prev => ({ ...prev, bedrooms: '1', lift: 'No', grandparents: 'No', children: '0' }));
      } else if (selectedData?.plotSize === 'full-site') {
        setAnswers(prev => ({ ...prev, bedrooms: '3', lift: 'No', grandparents: 'No', children: '0' }));
      } else if (selectedData?.plotSize === 'double-site') {
        if (!answers.bedrooms) {
          setAnswers(prev => ({ ...prev, bedrooms: '3', lift: 'No', grandparents: 'No', children: '0' }));
        }
      }
    }
  }, [selectedData, answers.bedrooms]);

  const getQuestions = () => {
    const isRental = selectedData?.projectType === 'rental-homes';
    const isDreamHouse = selectedData?.projectType === 'dream-house';


    if (isDreamHouse) {
      return [
        { id: 'family-size', question: 'What is your family size?', type: 'options', options: ['1', '2', '3', '4', 'Custom'], custom: true },
        { id: 'grandparents', question: 'Grandparents living with you?', type: 'toggle', options: ['Yes', 'No'] },
        { id: 'children', question: 'How many children do you have?', type: 'options', options: ['1', '2', '3', 'Custom'], custom: true },
        { id: 'bedrooms', question: 'How many bedrooms do you need?', type: 'options', options: ['3', '4', '5', 'Custom'], custom: true },
        { id: 'lift', question: 'Do you need a lift/elevator?', type: 'toggle', options: ['Yes', 'No'] }
      ];
    }


    if (isRental) {
      const questions = [
        { id: 'total-members', question: 'How many members do you have?', type: 'options', options: ['2', '4', '6', '8', 'Custom'], custom: true },
        { id: 'parking', question: 'Ground floor for parking?', type: 'toggle', options: ['Yes', 'No'] }
      ];

      if (selectedData?.plotSize === 'double-site') {
        questions.push({ id: 'bedrooms', question: 'Number of BHK for Units?', type: 'options', options: ['3', '4'] });
        questions.push({ id: 'lift', question: 'Do you need a lift/elevator?', type: 'toggle', options: ['Yes', 'No'] });
      }

      return questions;
    }


    return [
      { id: 'family-size', question: 'What is your family size?', type: 'options', options: ['1', '2', '3', '4', 'Custom'], custom: true },
      { id: 'bedrooms', question: 'How many bedrooms do you need?', type: 'options', options: ['3', '4', '5', 'Custom'], custom: true }
    ];
  };

  const additionalQuestions = getQuestions();

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleBack = () => {
    onBack();
  };

  const handleSubmit = () => {
    onComplete({ ...selectedData, answers });
  };

  const allAnswered = additionalQuestions.every(q => answers[q.id]);

  return (
    <motion.div
      className="min-h-screen relative overflow-hidden p-6"
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Black Building Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')`,
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/65 to-black/75" />

      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 30% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 70% 50%, rgba(255, 165, 0, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 70%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 30% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto pb-8">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <motion.button
            onClick={handleBack}
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-white font-semibold transition-all"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </motion.button>

          <h1
            className="text-4xl font-bold text-white text-center"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              textShadow: '0 0 30px rgba(255, 215, 0, 0.3), 0 4px 20px rgba(0, 0, 0, 0.8)',
            }}
          >
            Additional Details
          </h1>
          <div className="w-24"></div>
        </motion.div>

        {/* Glassmorphic Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="p-8 md:p-10 rounded-[2.5rem] overflow-hidden"
          style={{
            background: 'rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2), inset 0 0 60px rgba(255, 255, 255, 0.1)',
          }}
        >

          {/* Snapshot Summary - Consistent Top Bar */}
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-1 bg-black/20 rounded-2xl border border-white/5">
              <div className="p-4 rounded-xl hover:bg-white/5 transition-colors text-center md:text-left">
                <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1">Project</p>
                <p className="text-base font-bold text-white tracking-wide">{selectedData?.projectType === 'dream-house' ? 'Dream House' : 'Rental'}</p>
              </div>
              <div className="p-4 rounded-xl hover:bg-white/5 transition-colors text-center md:text-left">
                <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1">Plot Size</p>
                <p className="text-base font-bold text-white tracking-wide capitalize">{selectedData?.plotSize?.replace('-', ' ')}</p>
              </div>
              <div className="p-4 rounded-xl hover:bg-white/5 transition-colors text-center md:text-left">
                <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1">Dimensions</p>
                <p className="text-base font-bold text-white tracking-wide">{selectedData?.dimensions}</p>
              </div>
            </div>
          </div>

          {/* All Questions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start align-top"
          >
            {/* Half Site Note */}
            {selectedData?.projectType === 'rental-homes' && selectedData?.plotSize === 'half-site' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-1 md:col-span-2 mb-4 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-xl text-center"
              >
                <p className="text-yellow-200 font-semibold text-lg flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Note: Half Site rental units are designed with a Single Bedroom layout.
                </p>
              </motion.div>
            )}

            {/* Full Site Note */}
            {selectedData?.projectType === 'rental-homes' && selectedData?.plotSize === 'full-site' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-1 md:col-span-2 mb-4 p-4 bg-blue-500/20 border border-blue-500/50 rounded-xl text-center"
              >
                <p className="text-blue-200 font-semibold text-lg flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Note: Full Site rental units are designed with a Double Bedroom layout.
                </p>
              </motion.div>
            )}

            {/* Double Site Note */}
            {selectedData?.projectType === 'rental-homes' && selectedData?.plotSize === 'double-site' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-1 md:col-span-2 mb-4 p-4 bg-purple-500/20 border border-purple-500/50 rounded-xl text-center"
              >
                <p className="text-purple-200 font-semibold text-lg flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Note: Double Site (60x40+) allows for larger 3BHK or 4BHK rental units.
                </p>
              </motion.div>
            )}

            {additionalQuestions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className={`text-center ${additionalQuestions.length % 2 !== 0 && index === additionalQuestions.length - 1 ? 'md:col-span-2' : ''}`}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                  className="p-4 rounded-2xl h-full flex flex-col justify-center"
                  style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(20px)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 0 60px rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <h2
                    className="text-xl font-bold text-white mb-4"
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      textShadow: '0 2px 15px rgba(0, 0, 0, 0.8)',
                    }}
                  >
                    {question.question}
                  </h2>

                  <div className="w-full">
                    {question.type === 'toggle' ? (
                      <div className="flex gap-4 justify-center">
                        {question.options.map((option, optionIndex) => (
                          <motion.button
                            key={option}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 + index * 0.1 + optionIndex * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAnswer(question.id, option)}
                            className={`px-6 py-2 rounded-xl text-white font-bold text-base ${answers[question.id] === option ? 'ring-4 ring-yellow-400' : ''}`}
                            style={{
                              background: answers[question.id] === option
                                ? 'rgba(255, 215, 0, 0.3)'
                                : 'rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(15px)',
                              border: '2px solid rgba(255, 255, 255, 0.3)',
                              boxShadow: answers[question.id] === option
                                ? '0 0 30px rgba(255, 215, 0, 0.4)'
                                : '0 8px 24px rgba(0, 0, 0, 0.3)',
                              fontFamily: "'Montserrat', sans-serif",
                            }}
                          >
                            {option}
                          </motion.button>
                        ))}
                      </div>
                    ) : question.type === 'options' ? (
                      <div className="flex flex-wrap gap-3 justify-center">
                        {question.options.map((option, optionIndex) => (
                          <motion.button
                            key={option}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 + index * 0.1 + optionIndex * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAnswer(question.id, option)}
                            className={`px-5 py-2 rounded-xl text-white font-bold text-base ${answers[question.id] === option ? 'ring-4 ring-yellow-400' : ''}`}
                            style={{
                              background: answers[question.id] === option
                                ? 'rgba(255, 215, 0, 0.3)'
                                : 'rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(15px)',
                              border: '2px solid rgba(255, 255, 255, 0.3)',
                              boxShadow: answers[question.id] === option
                                ? '0 0 30px rgba(255, 215, 0, 0.4)'
                                : '0 8px 24px rgba(0, 0, 0, 0.3)',
                              fontFamily: "'Montserrat', sans-serif",
                            }}
                          >
                            {option}
                          </motion.button>
                        ))}
                        {question.custom && (
                          <motion.input
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.9 + index * 0.1 }}
                            type="number"
                            placeholder="Custom"
                            value={answers[question.id] && !question.options.includes(answers[question.id]) ? answers[question.id] : ''}
                            onChange={(e) => handleAnswer(question.id, e.target.value)}
                            className="px-4 py-2 rounded-xl text-white text-center font-semibold w-24"
                            style={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(15px)',
                              border: '2px solid rgba(255, 255, 255, 0.3)',
                              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                              fontFamily: "'Montserrat', sans-serif",
                            }}
                          />
                        )}
                      </div>
                    ) : (
                      <motion.input
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        type="number"
                        placeholder="Enter value"
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswer(question.id, e.target.value)}
                        className="w-full px-4 py-2 rounded-xl text-white text-center text-base font-semibold"
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(15px)',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                          fontFamily: "'Montserrat', sans-serif",
                        }}
                      />
                    )}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-12 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={!allAnswered}
              className={`px-8 py-3 rounded-xl text-white font-semibold text-lg ${allAnswered ? '' : 'opacity-50 cursor-not-allowed'}`}
              style={{
                background: allAnswered
                  ? 'rgba(255, 215, 0, 0.8)'
                  : 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(15px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: allAnswered
                  ? '0 0 30px rgba(255, 215, 0, 0.4)'
                  : '0 8px 24px rgba(0, 0, 0, 0.3)',
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              {allAnswered ? 'Next' : 'Please answer all questions'}
            </motion.button>
            {allAnswered && (
              <p className="text-white/70 mt-4 text-lg">
                Thanks for all the details! Let's select floor details.
              </p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
