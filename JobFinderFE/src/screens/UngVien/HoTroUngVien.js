import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';

export default function HoTroUngVien() {
  const [selectedMessage, setSelectedMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const scaleValue = useState(new Animated.Value(0))[0];

  const helpTopics = [
    {
      title: 'Thay đổi thông tin cá nhân',
      message:
        'Bạn có thể thay đổi thông tin cá nhân trong mục "Tài khoản". Nếu vẫn gặp lỗi, vui lòng liên hệ hỗ trợ.',
    },
    {
      title: 'Tài khoản không hiển thị thông tin',
      message:
        'Hãy đảm bảo bạn đã đăng nhập và cập nhật hồ sơ. Nếu vẫn không hiển thị, vui lòng đăng xuất và đăng nhập lại.',
    },
    {
      title: 'Không thể tra cứu danh sách công việc',
      message:
        'Hãy kiểm tra kết nối internet và thử lại. Nếu vẫn lỗi, hãy gửi phản hồi cho chúng tôi.',
    },
    {
      title: 'Cách phòng tránh tin tuyển dụng lừa đảo',
      message:
        'Luôn xác minh thông tin công ty trước khi nộp hồ sơ. Không cung cấp thông tin cá nhân quan trọng cho bên không rõ ràng.',
    },
  ];

  const openMessage = message => {
    setSelectedMessage(message);
    setShowModal(true);
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
    }).start();
  };

  const closeMessage = () => {
    Animated.timing(scaleValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowModal(false);
      setSelectedMessage('');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hỗ trợ</Text>
      <Text style={styles.subtitle}>Chọn chuyên mục:</Text>

      {helpTopics.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.button}
          onPress={() => !showModal && openMessage(item.message)}>
          <Image
            source={require('../../assets/react_logo.png')}
            style={styles.icon}
            resizeMode="contain"
          />
          <Text style={styles.buttonText}>{item.title}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Nếu cần hỗ trợ gấp, hãy liên hệ:</Text>
        <Text style={styles.footerText}>Email: JobFinder@gmail.com</Text>
        <Text style={styles.footerText}>Hotline: 090900802</Text>
      </View>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={closeMessage}>
        <TouchableWithoutFeedback>
          <View style={styles.overlay}>
            <Animated.View
              style={[styles.modalContent, {transform: [{scale: scaleValue}]}]}>
              <TouchableOpacity
                onPress={closeMessage}
                style={styles.closeButton}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.messageText}>{selectedMessage}</Text>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f8',
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#388E3C',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    color: '#475569',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#e0ecff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  icon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  buttonText: {
    color: '#388E3C',
    fontWeight: '500',
    fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 360,
    position: 'relative',
    elevation: 6,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 14,
    zIndex: 10,
  },
  closeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#388E3C',
  },
  messageText: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: '#334155',
  },
});
