import * as React from 'react';
import { View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

type ConfirmDialogProps = {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
};

export default function ConfirmExitDialog({ visible, onDismiss, onConfirm }: ConfirmDialogProps) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Exit Test</Dialog.Title>
        <Dialog.Content>
          <Text>Are you sure you want to end the test?</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button
            textColor="red"
            onPress={() => {
              onDismiss();
              onConfirm();
            }}>
            End
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
