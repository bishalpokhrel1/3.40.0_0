import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

const AISuggestions: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4"
    >
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
        <Lightbulb className="mr-2" /> AI Suggestions
      </h2>
      <div className="text-white/70 text-center py-4">
        AI suggestions will be available soon. This feature is currently in development.
      </div>
    </motion.div>
  );
};

export default AISuggestions;