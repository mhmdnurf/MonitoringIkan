import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Dimensions,
  Pressable,
  Animated,
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
  otomatis: string;
  POMPA1: string;
  POMPA2: string;
}
const Dashboard = (): React.JSX.Element => {
  const [dataMonitoring, setDataMonitoring] = useState<DataMonitoring | null>(
    null,
  );
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const scrollY = new Animated.Value(0);

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
                otomatis: fetchedData.OTOMATIS,
                POMPA1: fetchedData.POMPA1,
                POMPA2: fetchedData.POMPA2,
              });
            } else {
              setDataMonitoring(null);
            }
          });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    fetchData();
    return () => clearInterval(intervalId);
  }, []);

  const handlePompaAutomatisClick = () => {
    try {
      database()
        .ref('/FirebasePWI')
        .update({OTOMATIS: '1', POMPA1: '0', POMPA2: '0'});
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };
  const handlePompaManualSatu = () => {
    try {
      const ref = database().ref('/FirebasePWI');
      ref.once('value', snapshot => {
        const pompa1 = snapshot.val().POMPA1;
        ref.update({OTOMATIS: '0', POMPA1: pompa1 === '1' ? '0' : '1'});
      });
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };
  const handlePompaManualDua = () => {
    try {
      const ref = database().ref('/FirebasePWI');
      ref.once('value', snapshot => {
        const pompa2 = snapshot.val().POMPA2;
        ref.update({OTOMATIS: '0', POMPA2: pompa2 === '1' ? '0' : '1'});
      });
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [300, 80],
    extrapolate: 'clamp',
  });

  const formattedTime = currentDateTime.toLocaleTimeString();
  const formattedDate = currentDateTime.toLocaleDateString();
  const dayOfWeek = new Intl.DateTimeFormat('id-ID', {weekday: 'long'}).format(
    currentDateTime,
  );

  return (
    <>
      <StatusBar barStyle="default" backgroundColor="#BEADFA" />
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}>
        {/* Header Start */}
        <Animated.View style={[styles.headerContainer, {height: headerHeight}]}>
          <Text style={styles.header}>Monitoring Air</Text>
          <View style={styles.svgContainer}>
            <Fish width={300} height={400} />
          </View>
        </Animated.View>
        {/* Header End */}
        {/* Date Start */}
        <View style={styles.dateContainer}>
          <Text style={styles.dayOfWeekText}>{dayOfWeek}</Text>
          <Text style={styles.clockText}>{formattedTime}</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>
        {/* Date End */}
        {/* Pompa Air Otomatis */}
        <Text style={styles.statusHeader}>Pompa Otomatis</Text>
        <View style={styles.pompaContainer}>
          <Pressable onPress={handlePompaAutomatisClick}>
            <View
              style={
                dataMonitoring?.otomatis === '1'
                  ? styles.pompaCardOn
                  : styles.pompaCardOff
              }>
              <Text style={styles.pompaText}>
                Pompa 1 {dataMonitoring?.otomatis === '1' ? 'ON' : 'OFF'}
              </Text>
            </View>
          </Pressable>
          <Pressable onPress={handlePompaAutomatisClick}>
            <View
              style={
                dataMonitoring?.otomatis === '1'
                  ? styles.pompaCardOn
                  : styles.pompaCardOff
              }>
              <Text style={styles.pompaText}>
                Pompa 2 {dataMonitoring?.otomatis === '1' ? 'ON' : 'OFF'}
              </Text>
            </View>
          </Pressable>
        </View>
        {/* Pompa Manual */}
        <Text style={styles.statusHeader}>Pompa Manual</Text>
        <View style={styles.pompaContainer}>
          <Pressable onPress={handlePompaManualSatu}>
            <View
              style={
                dataMonitoring?.POMPA1 === '1'
                  ? styles.pompaCardOn
                  : styles.pompaCardOff
              }>
              <Text style={styles.pompaText}>
                Pompa 1 {dataMonitoring?.POMPA1 === '1' ? 'ON' : 'OFF'}
              </Text>
            </View>
          </Pressable>
          <Pressable onPress={handlePompaManualDua}>
            <View
              style={
                dataMonitoring?.POMPA2 === '1'
                  ? styles.pompaCardOn
                  : styles.pompaCardOff
              }>
              <Text style={styles.pompaText}>
                Pompa 2 {dataMonitoring?.POMPA2 === '1' ? 'ON' : 'OFF'}
              </Text>
            </View>
          </Pressable>
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
      </Animated.ScrollView>
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
    color: '#6F7789',
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
  pompaContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: 15,
  },
  pompaCardOn: {
    backgroundColor: '#B1C381',
    minWidth: 180,
    padding: 20,
    borderRadius: 15,
  },
  pompaCardOff: {
    backgroundColor: '#DC8686',
    minWidth: 180,
    padding: 20,
    borderRadius: 15,
  },
  pompaText: {
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  clockText: {
    fontSize: 24,
    color: 'white',
    fontWeight: '600',
  },
  dateText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
  dayOfWeekText: {
    fontSize: 18,
    marginTop: 5,
    color: 'white',
    fontWeight: '600',
  },
  dateContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#8EA7E9',
    elevation: 5,
  },
});
