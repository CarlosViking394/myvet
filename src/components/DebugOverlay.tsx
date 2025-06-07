import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  Alert,
  Share,
} from 'react-native';
import debugService from '../services/debug/DebugService';

const DebugOverlay = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'error' | 'warn'>('all');

  useEffect(() => {
    const unsubscribe = debugService.addListener((log) => {
      setLogs(debugService.getLogs());
    });

    // Load initial logs
    setLogs(debugService.getLogs());

    return unsubscribe;
  }, []);

  const handleShare = async () => {
    try {
      const logsString = debugService.exportLogs();
      await Share.share({
        message: logsString,
        title: 'Debug Logs',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share logs');
    }
  };

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    if (filter === 'error') return log.level === 'error';
    if (filter === 'warn') return log.level === 'warn' || log.level === 'error';
    return true;
  });

  const getLogColor = (level: string) => {
    switch (level) {
      case 'error': return '#ef4444';
      case 'warn': return '#f59e0b';
      case 'info': return '#3b82f6';
      case 'debug': return '#6b7280';
      default: return '#1e293b';
    }
  };

  if (!__DEV__) return null;

  return (
    <>
      {/* Floating Debug Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setIsVisible(true)}
      >
        <Text style={styles.floatingButtonText}>🐛</Text>
        {logs.filter(l => l.level === 'error').length > 0 && (
          <View style={styles.errorBadge}>
            <Text style={styles.errorBadgeText}>
              {logs.filter(l => l.level === 'error').length}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Debug Modal */}
      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsVisible(false)}
      >
        <SafeAreaView style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Debug Console</Text>
            <TouchableOpacity onPress={() => setIsVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filters}>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'all' && styles.filterActive]}
              onPress={() => setFilter('all')}
            >
              <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                All ({logs.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'warn' && styles.filterActive]}
              onPress={() => setFilter('warn')}
            >
              <Text style={[styles.filterText, filter === 'warn' && styles.filterTextActive]}>
                Warnings ({logs.filter(l => l.level === 'warn').length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'error' && styles.filterActive]}
              onPress={() => setFilter('error')}
            >
              <Text style={[styles.filterText, filter === 'error' && styles.filterTextActive]}>
                Errors ({logs.filter(l => l.level === 'error').length})
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                debugService.clearLogs();
                setLogs([]);
              }}
            >
              <Text style={styles.actionText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.logsContainer}>
            {filteredLogs.length === 0 ? (
              <Text style={styles.emptyText}>No logs to display</Text>
            ) : (
              filteredLogs.map((log, index) => (
                <View key={index} style={styles.logEntry}>
                  <View style={styles.logHeader}>
                    <Text style={[styles.logLevel, { color: getLogColor(log.level) }]}>
                      {log.level.toUpperCase()}
                    </Text>
                    <Text style={styles.logComponent}>{log.component}</Text>
                    <Text style={styles.logTime}>
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </Text>
                  </View>
                  <Text style={styles.logMessage}>{log.message}</Text>
                  {log.data && (
                    <Text style={styles.logData}>
                      {JSON.stringify(log.data, null, 2)}
                    </Text>
                  )}
                  {log.stackTrace && (
                    <Text style={styles.logStack}>{log.stackTrace}</Text>
                  )}
                </View>
              ))
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  floatingButtonText: {
    fontSize: 24,
  },
  errorBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modal: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1e293b',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    fontSize: 24,
    color: 'white',
    padding: 8,
  },
  filters: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
  },
  filterActive: {
    backgroundColor: '#1e293b',
  },
  filterText: {
    color: '#64748b',
    fontSize: 14,
  },
  filterTextActive: {
    color: 'white',
  },
  actions: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
  },
  actionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  logsContainer: {
    flex: 1,
    padding: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 16,
    marginTop: 50,
  },
  logEntry: {
    backgroundColor: 'white',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  logHeader: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  logLevel: {
    fontWeight: 'bold',
    fontSize: 12,
    marginRight: 8,
  },
  logComponent: {
    fontSize: 12,
    color: '#475569',
    flex: 1,
  },
  logTime: {
    fontSize: 12,
    color: '#94a3b8',
  },
  logMessage: {
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 4,
  },
  logData: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'monospace',
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  logStack: {
    fontSize: 10,
    color: '#94a3b8',
    fontFamily: 'monospace',
    marginTop: 4,
  },
});

export default DebugOverlay; 