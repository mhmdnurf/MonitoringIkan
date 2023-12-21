import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Dimensions,
} from 'react-native';
import database from '@react-native-firebase/database';
import Fish from './fish.svg';

interface DataMonitoring {
  kekeruhan: number;
  ketinggian_air: number;
  pH: number;
  suhu: number;
  statusKekeruhan: string;
  statusKetinggianAir: string;
  statusSuhu: string;
  statusPH: string;
}
const Dashboard = (): React.JSX.Element => {
  const [dataMonitoring, setDataMonitoring] = useState<DataMonitoring | null>(
    null,
  );

  useEffect(() => {
    const fetchData = () => {
      try {
        database()
          .ref('/FirebasePWI')
          .on('value', snapshot => {
            const fetchedData = snapshot.val();
            if (fetchedData) {
              setDataMonitoring({
                kekeruhan: fetchedData.Kekeruhan,
                ketinggian_air: fetchedData['Ketinggian AIR'],
                pH: fetchedData.pH,
                suhu: fetchedData.SUHU,
                statusKekeruhan: fetchedData['status KEKERUHAN AIR'],
                statusKetinggianAir: fetchedData['status KETINGGIAN AIR'],
                statusSuhu: fetchedData['status SUHU'],
                statusPH: fetchedData['status pH'],
              });
            } else {
              setDataMonitoring(null);
            }
          });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <StatusBar barStyle="default" backgroundColor="#BEADFA" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Monitoring Air</Text>
          <View style={styles.svgContainer}>
            <Fish width={300} height={400} />
          </View>
        </View>
        {/* Status */}
        <Text style={styles.statusHeader}>Status Monitoring</Text>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={styles.statusContainer}>
            <View style={styles.statusKekeruhan}>
              <Text style={styles.textKekeruhan}>Kekeruhan Air</Text>
              <Text style={styles.statusValue}>
                {dataMonitoring?.statusKekeruhan}
              </Text>
            </View>
            <View style={styles.statusKetinggian}>
              <Text style={styles.textKetinggian}>Ketinggian Air</Text>
              <Text style={styles.statusValue}>
                {dataMonitoring?.statusKetinggianAir}
              </Text>
            </View>
            <View style={styles.statusSuhu}>
              <Text style={styles.textSuhu}>Suhu Air</Text>
              <Text style={styles.statusValue}>
                {dataMonitoring?.statusSuhu}
              </Text>
            </View>
            <View style={styles.statuspH}>
              <Text style={styles.textpH}>Status pH</Text>
              <Text style={styles.statusValue}>{dataMonitoring?.statusPH}</Text>
            </View>
          </View>
        </ScrollView>
        {/* Kekeruhan Air */}
        <Text style={styles.statusHeader}>Nilai Monitoring</Text>
        <View style={styles.kekeruhanContent}>
          <View style={styles.cardContentContainer}>
            <Text style={styles.cardText}>Kekeruhan Air</Text>
            <Text style={styles.cardValText}>{dataMonitoring?.kekeruhan}</Text>
          </View>
        </View>
        <View style={styles.ketinggianContent}>
          <View style={styles.cardContentContainer}>
            <Text style={styles.cardText}>Ketinggian Air</Text>
            <Text style={styles.cardValText}>
              {dataMonitoring?.ketinggian_air}
            </Text>
          </View>
        </View>
        <View style={styles.suhuContent}>
          <View style={styles.cardContentContainer}>
            <Text style={styles.cardText}>Suhu</Text>
            <Text style={styles.cardValText}>{dataMonitoring?.suhu}</Text>
          </View>
        </View>
        <View style={styles.phContent}>
          <View style={styles.cardContentContainer}>
            <Text style={styles.cardText}>Nilai pH</Text>
            <Text style={styles.cardValText}>{dataMonitoring?.pH}</Text>
          </View>
        </View>
        <View style={styles.bottomSpace} />
      </ScrollView>
    </>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  scrollContainer: {backgroundColor: 'white'},
  header: {
    padding: 10,
    textAlign: 'left',
    fontWeight: '600',
    fontSize: 30,
    marginLeft: 10,
    marginTop: 20,
    color: 'white',
  },
  headerContainer: {
    backgroundColor: '#BEADFA',
    height: 300,
    borderBottomLeftRadius: 70,
  },
  svgContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginRight: 30,
  },
  cardText: {
    textAlign: 'left',
    fontWeight: '600',
    fontSize: 20,
    color: 'white',
  },
  cardValText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 20,
    color: '#6F7789',
    padding: 20,
    backgroundColor: 'white',
    minWidth: 100,
    borderRadius: 10,
  },
  cardContentContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  kekeruhanContent: {
    padding: 20,
    backgroundColor: '#ECEE81',
    marginTop: 20,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  ketinggianContent: {
    padding: 20,
    backgroundColor: '#8DDFCB',
    marginTop: 20,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  suhuContent: {
    padding: 20,
    backgroundColor: '#82A0D8',
    marginTop: 20,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  phContent: {
    padding: 20,
    backgroundColor: '#EFB495',
    marginTop: 20,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  statusContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 20,
  },
  statusHeader: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: '600',
    marginLeft: 10,
  },
  statusKekeruhan: {
    backgroundColor: 'white',
    padding: 10,
    width: Dimensions.get('window').width - 225,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: '#C8E4B2',
    marginHorizontal: 10,
  },
  statusKetinggian: {
    backgroundColor: 'white',
    padding: 10,
    width: Dimensions.get('window').width - 225,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: '#BEADFA',
    marginHorizontal: 10,
  },
  statusSuhu: {
    backgroundColor: 'white',
    padding: 10,
    width: Dimensions.get('window').width - 225,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: '#FFC6AC',
    marginHorizontal: 10,
  },
  statuspH: {
    backgroundColor: 'white',
    padding: 10,
    width: Dimensions.get('window').width - 225,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: '#CBB279',
    marginHorizontal: 10,
  },
  textKekeruhan: {fontWeight: '600', color: '#94A684', fontSize: 18},
  textKetinggian: {fontWeight: '600', color: '#8294C4', fontSize: 18},
  textSuhu: {fontWeight: '600', color: '#F4B183', fontSize: 18},
  textpH: {fontWeight: '600', color: '#867070', fontSize: 18},
  statusValue: {fontWeight: '600', color: '#6F7789', fontSize: 18},
  bottomSpace: {
    marginBottom: 40,
  },
});
