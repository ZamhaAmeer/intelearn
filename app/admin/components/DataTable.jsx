import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DataTable({ 
  headers, 
  data = [], 
  renderRow, 
  searchVal, 
  onSearchChange, 
  searchPlaceholder = "Search records...", 
  onAddPress, 
  addButtonText = "Add New",
  isLoading = false 
}) {
  return (
    <View style={styles.container}>
      {/* Search Bar & Actions */}
      <View style={styles.actionHeader}>
        {onSearchChange && (
          <View style={styles.searchWrapper}>
            <Ionicons name="search" size={20} color="#6F767E" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder={searchPlaceholder}
              placeholderTextColor="#A0A0A0"
              value={searchVal}
              onChangeText={onSearchChange}
              autoCapitalize="none"
            />
            {searchVal ? (
              <TouchableOpacity onPress={() => onSearchChange('')}>
                <Ionicons name="close-circle" size={18} color="#6F767E" />
              </TouchableOpacity>
            ) : null}
          </View>
        )}
        
        {onAddPress && (
          <TouchableOpacity style={styles.addButton} onPress={onAddPress} activeOpacity={0.8}>
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.addButtonText}>{addButtonText}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Table Content */}
      <View style={styles.tableWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View style={styles.tableInner}>
            {/* Header Row */}
            <View style={styles.headerRow}>
              {headers.map((header, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.headerCell, 
                    header.style || {}, 
                    { width: header.width || 150 }
                  ]}
                >
                  <Text style={styles.headerText}>{header.title || header}</Text>
                </View>
              ))}
            </View>

            {/* Table Body */}
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#5B3CC2" />
                <Text style={styles.loadingText}>Loading records...</Text>
              </View>
            ) : data.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="file-tray-outline" size={48} color="#BEC2C6" />
                <Text style={styles.emptyText}>No records found</Text>
              </View>
            ) : (
              <ScrollView nestedScrollEnabled={true} style={styles.rowsScroll}>
                {data.map((item, index) => (
                  <View 
                    key={item.id || index} 
                    style={[
                      styles.dataRow, 
                      index % 2 === 1 && styles.alternateRow,
                      index === data.length - 1 && styles.lastRow
                    ]}
                  >
                    {renderRow(item, index)}
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    marginVertical: 10,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F5F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1A1D20',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5B3CC2', // Purple theme
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 14,
  },
  tableWrapper: {
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableInner: {
    flexDirection: 'column',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#F4F5F6',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    paddingVertical: 12,
  },
  headerCell: {
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  headerText: {
    color: '#6F767E',
    fontWeight: '600',
    fontSize: 13,
    textTransform: 'uppercase',
  },
  rowsScroll: {
    maxHeight: 450,
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  alternateRow: {
    backgroundColor: '#FAFBFC',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 600,
  },
  loadingText: {
    marginTop: 10,
    color: '#6F767E',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 600,
  },
  emptyText: {
    marginTop: 8,
    color: '#9A9FA5',
    fontSize: 14,
  },
});
