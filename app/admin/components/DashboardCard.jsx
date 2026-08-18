import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function DashboardCard({ title, value, icon, color, trend, onPress }) {
  // Determine if we should wrap in touchable or regular view
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container 
      style={[styles.card, { borderLeftColor: color }]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.textContainer}>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          <Ionicons name={icon} size={26} color={color} />
        </View>
      </View>
      
      {trend && (
        <View style={styles.cardFooter}>
          <Ionicons name="trending-up-outline" size={14} color="#4CAF50" style={styles.trendIcon} />
          <Text style={styles.trendText}>{trend}</Text>
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    minWidth: 160,
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1D20',
  },
  title: {
    fontSize: 14,
    color: '#6F767E',
    marginTop: 4,
    fontWeight: '500',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F4F5F6',
    paddingTop: 10,
  },
  trendIcon: {
    marginRight: 4,
  },
  trendText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
});
