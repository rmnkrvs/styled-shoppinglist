import { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import {
    TextInput,
    Button,
    List,
    IconButton,
    Divider,
    Text,
    Card,
    useTheme,
} from 'react-native-paper';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';

import * as SQLite from 'expo-sqlite';

type ListItem = {
    id: number;
    product: string;
    amount: string;
}

const db = SQLite.openDatabaseSync('shoppinglistdb');

export default function ShoppingList() {

    useDrizzleStudio(db);

    const theme = useTheme();

    const [product, setProduct] = useState('');
    const [amount, setAmount] = useState('');
    const [listItem, setListItems] = useState<ListItem[]>([]);

    const initialize = async () => {
        try {
            await db.execAsync(`
        CREATE TABLE IF NOT EXISTS listitem (id INTEGER PRIMARY KEY NOT NULL, product TEXT, amount TEXT);
        `);
            handleFetch();
        } catch (error) {
            console.error('Could not open database', error);
        }
    }

    const handleSave = async () => {
        try {
            await db.runAsync('INSERT INTO listitem (product, amount) VALUES (?, ?)', product, amount);
            setProduct('');
            setAmount('');
            handleFetch();
        } catch (error) {
            console.error('Could not add item', error);
        }
    }

    const handleFetch = async () => {
        try {
            const list = await db.getAllAsync('SELECT * from listitem');
            setListItems(list as ListItem[]);
        } catch (error) {
            console.error('Could not get items', error);
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await db.runAsync('DELETE FROM listitem WHERE id=?', id);
            await handleFetch();
        }
        catch (error) {
            console.error('Could not delete item', error);
        }
    }

    useEffect(() => { initialize() }, []);

    return (

        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

            <Text variant='titleMedium'>Add items to your shopping list</Text>

            <TextInput
                style={styles.input}
                mode='outlined'
                label='product'
                onChangeText={text => setProduct(text)}
                value={product}
                outlineColor="#B0BEC5"
                activeOutlineColor="#2E7D6B"
                outlineStyle={{ borderRadius: 12 }}
            />
            <TextInput
                style={styles.input}
                mode='outlined'
                label='amount'
                onChangeText={text => setAmount(text)}
                value={amount}
                outlineColor="#B0BEC5"
                activeOutlineColor="#2E7D6B"
                outlineStyle={{ borderRadius: 12 }}
            />

            <View style={styles.buttons}>
                <Button
                    mode='contained'
                    icon='plus'
                    onPress={handleSave}
                >
                    Add
                </Button>
            </View>

            <Card mode='contained' style={styles.card}>
                <FlatList
                    data={listItem}
                    keyExtractor={(item) => item.id.toString()}
                    ItemSeparatorComponent={Divider}
                    ListEmptyComponent={
                        <Text style={styles.empty}>Shopping list is empty</Text>
                    }
                    renderItem={({ item }) => (
                        <List.Item
                            title={item.product}
                            description={item.amount}
                            right={(props) => (
                                <IconButton
                                    {...props}
                                    icon="delete-outline"
                                    onPress={() => handleDelete(item.id)}
                                />
                            )}
                        />
                    )}
                />
            </Card>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 30,
        gap: 10,
    },
    input: {
        width: 250,
    },
    buttons: {
        width: 250,
        marginTop: 10,
    },
    card: {
        flex: 1,
        width: '90%',
        marginTop: 20,
    },
    empty: {
        textAlign: 'center',
        margin: 24,
    },
    listItem: {
        fontSize: 16,
        textAlign: 'center',
    },
    listItemBought: {
        fontSize: 16,
        textAlign: 'center',
        color: 'blue',
    },
});