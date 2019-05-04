import firebase from 'firebase'

export default {
    namespaced: true,
    state: {
        alarm: null,
        lock: null
    },
    mutations: {
        setAlarm (state, payload) {
            state.alarm = payload
        },
        setLock (state, payload) {
            state.lock = payload
        }
    },
    actions: {
        fetchConfig({commit}) {
            firebase.firestore().collection('config').doc('DYoThSRAElmX50fQI6jB')
            .onSnapshot( doc => {
                commit('setAlarm', doc.data().alarm)
                commit('setLock', doc.data().lock)
            });
        },
        updateAlarm(context, status) {
            firebase.firestore().collection('config').doc('DYoThSRAElmX50fQI6jB').update({
                alarm: status
            }).then(function() {
                console.log("Alarm successfully updated!");
            })
            .catch(function(error) {
                // The document probably doesn't exist.
                console.error("Error updating alarm: ", error);
            });
        }
    },
    getters: {
        getAlarm: state => {
            return state.alarm
        },
        getLock: state => {
            return state.lock
        }
    }
}