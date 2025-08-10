/* eslint-disable react-native/no-inline-styles */
import { JSX, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import Spinner from './Spinner';
import Button from './Button';

export default function LoadingBase({
  onCancel,
  cancelLabel
}: {
  onCancel?: () => void;
  cancelLabel?: string
}): JSX.Element {
  const [isCancelButtonShown, setIsCancelButtonShown] = useState(false)

  const timeoutShowCancelButton = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    timeoutShowCancelButton.current = setTimeout(() => {
      setIsCancelButtonShown(true)
    }, 3000)
    return () => {
      if(timeoutShowCancelButton.current) clearTimeout(timeoutShowCancelButton.current)
    }
  }, [])

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 15,
      }}
    >
      <Spinner />
      {(onCancel && isCancelButtonShown) && (
        <View style={{ marginTop: 20 }}>
          <Button onPress={onCancel}>{cancelLabel || 'Batal'}</Button>
        </View>
      )}
    </View>
  );
}
