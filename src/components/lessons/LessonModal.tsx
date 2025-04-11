import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { lessonStyles } from "../../styles/LessonStyles";

type LessonModalProps = {
  visible: boolean;
  title: string;
  message: string;
  buttonText: string;
  onPress: () => void;
};

const LessonModal: React.FC<LessonModalProps> = ({
  visible,
  title,
  message,
  buttonText,
  onPress,
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={lessonStyles.modalContainer}>
        <View style={lessonStyles.modalContent}>
          <View style={lessonStyles.modalHeader}>
            <Text style={lessonStyles.modalTitle}>{title}</Text>
          </View>
          <View style={lessonStyles.modalBody}>
            <Text style={lessonStyles.modalMessage}>{message}</Text>
          </View>
          <View style={lessonStyles.modalFooter}>
            <TouchableOpacity
              style={lessonStyles.modalButton}
              onPress={onPress}
            >
              <Text style={lessonStyles.modalButtonText}>{buttonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LessonModal;
