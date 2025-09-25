import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { syncService } from '../services/syncService';
import type { TransferData } from '../types';

interface DataTransferScreenProps {
  navigation: any;
  route: {
    params?: {
      data?: TransferData;
    };
  };
}

const DataTransferScreen: React.FC<DataTransferScreenProps> = ({ navigation, route }) => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [transferResult, setTransferResult] = useState<'success' | 'error' | null>(null);
  const [transferData, setTransferData] = useState<TransferData | null>(null);

  useEffect(() => {
    const data = route.params?.data;
    if (data) {
      setTransferData(data);
      processTransfer(data);
    } else {
      setIsProcessing(false);
      setTransferResult('error');
    }
  }, [route.params]);

  const processTransfer = async (data: TransferData) => {
    try {
      setIsProcessing(true);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (data.type === 'sync') {
        await syncService.syncFromExternal(data);
      } else {
        await syncService.importData(data);
      }
      
      setTransferResult('success');
    } catch (error) {
      console.error('Transfer failed:', error);
      setTransferResult('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinue = () => {
    if (transferResult === 'success') {
      navigation.navigate('Dashboard');
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {isProcessing ? (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.processingText}>Processing data transfer...</Text>
            {transferData && (
              <Text style={styles.dataInfo}>
                {transferData.tasks?.length || 0} tasks, {transferData.notes?.length || 0} notes
              </Text>
            )}
          </View>
        ) : (
          <View style={styles.resultContainer}>
            {transferResult === 'success' ? (
              <>
                <Text style={styles.successIcon}>✅</Text>
                <Text style={styles.successTitle}>Transfer Complete!</Text>
                <Text style={styles.successMessage}>
                  Your data has been successfully synced to this device.
                </Text>
                {transferData && (
                  <View style={styles.transferSummary}>
                    <Text style={styles.summaryText}>
                      • {transferData.tasks?.length || 0} tasks transferred
                    </Text>
                    <Text style={styles.summaryText}>
                      • {transferData.notes?.length || 0} notes transferred
                    </Text>
                    <Text style={styles.summaryText}>
                      • Source: {transferData.source}
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <>
                <Text style={styles.errorIcon}>❌</Text>
                <Text style={styles.errorTitle}>Transfer Failed</Text>
                <Text style={styles.errorMessage}>
                  There was an error processing your data. Please try again.
                </Text>
              </>
            )}
            
            <TouchableOpacity
              style={[
                styles.continueButton,
                transferResult === 'success' ? styles.successButton : styles.errorButton
              ]}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>
                {transferResult === 'success' ? 'Continue to Dashboard' : 'Go Back'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  processingContainer: {
    alignItems: 'center',
  },
  processingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 20,
    textAlign: 'center',
  },
  dataInfo: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 10,
    textAlign: 'center',
  },
  resultContainer: {
    alignItems: 'center',
    maxWidth: 300,
  },
  successIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 10,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  errorMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  transferSummary: {
    backgroundColor: '#f0f9ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
    width: '100%',
  },
  summaryText: {
    fontSize: 14,
    color: '#1e40af',
    marginBottom: 5,
  },
  continueButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    minWidth: 200,
  },
  successButton: {
    backgroundColor: '#059669',
  },
  errorButton: {
    backgroundColor: '#dc2626',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default DataTransferScreen;