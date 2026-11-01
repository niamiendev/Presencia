// components/XQrScanner.tsx
import { colors } from '@/themes/colors'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { useRef } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

type Props = {
  onScan: (data: string) => void
}

const XQrScanner = ({ onScan }: Props) => {
  const [permission, requestPermission] = useCameraPermissions()
  const scanned = useRef(false) // évite les scans en rafale

  // Permission en cours de chargement
  if (!permission) return <View style={styles.container} />

  // Permission refusée ou pas encore demandée
  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.message}>
          L'accès à la caméra est nécessaire pour scanner un QR code.
        </Text>
        <Pressable style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Autoriser la caméra</Text>
        </Pressable>
      </View>
    )
  }

  const handleScan = ({ data }: { data: string }) => {
    if (scanned.current) return
    scanned.current = true
    onScan(data)

    // Réactive le scan après 2 secondes
    setTimeout(() => {
      scanned.current = false
    }, 2000)
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={handleScan}
      />

      {/* Cadre de visée */}
      <View style={styles.overlay} pointerEvents="none">
        <View style={styles.frame} />
      </View>
    </View>
  )
}

export default XQrScanner

const FRAME = 250

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { justifyContent: 'center', alignItems: 'center', padding: 24, gap: 16 },
  message: { color: '#fff', textAlign: 'center', fontSize: 16 },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    width: FRAME,
    height: FRAME,
    borderWidth: 3,
    borderColor: colors.primary,
    borderRadius: 24,
  },
})