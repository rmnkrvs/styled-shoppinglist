import { StatusBar } from 'expo-status-bar';
import { Appbar, MD3LightTheme, PaperProvider } from 'react-native-paper';

import ShoppingList from './ShoppingList';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2E7D6B',
    onPrimary: '#FFFFFF',
    primaryContainer: '#BFEBDD',
    onPrimaryContainer: '#00201A',
    secondaryContainer: '#CDE8DF',
    background: '#F7FAF8',
    surface: '#FFFFFF',
    surfaceVariant: '#DCE8E2',
    elevation: {
      ...MD3LightTheme.colors.elevation,
      level1: '#F1F6F3',
      level2: '#EAF1ED',
      level3: '#E3ECE7',
    },
  },
};

export default function App() {

  return (
    <PaperProvider theme={theme}>

      <Appbar.Header 
      elevated 
      mode='center-aligned'
      style={{ 
        backgroundColor: theme.colors.primary,
        height: 80,
        }}>
        <Appbar.Content 
        title="Shopping List"
        color={theme.colors.onPrimary}
        titleStyle={{ fontSize: 24, fontWeight: 'bold' }}
        />
      </Appbar.Header>

      <ShoppingList />

      <StatusBar style="light" />
    </PaperProvider>
  );
}
