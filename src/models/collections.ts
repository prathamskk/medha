import {
  collection,
  CollectionReference,
  DocumentData,
  FieldValue,
  PartialWithFieldValue,
  QueryDocumentSnapshot,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../config/firebase'

// This is just a helper to add the type to the db responses
export const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(db, collectionName).withConverter(converter()) as CollectionReference<T>
}

export const createSubCollection = <T = DocumentData>(
  collectionName: string,
  documentId: string,
  subCollectionName: string,
) => {
  return collection(db, collectionName, documentId, subCollectionName).withConverter(
    converter(),
  ) as CollectionReference<T>
}

const converter = <T>() => ({
  toFirestore: (data: PartialWithFieldValue<T>) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    return { id: snap.id, ...snap.data() } as T
  },
})

export interface Scenario {
  id?: string | null
  scenarioName: string
  scenarioVideoLink: string
  exemplarVideoLink: string
  scenarioThumbnailLink: string
  shortDescription: string
  description: string
}

export interface User {
  id?: string | null
  fcmToken: string | null
  hasEnabledNotification: boolean
  roles?: object
}

export interface Attempt {
  id?: string | null
  submissionTimestamp: Timestamp | FieldValue
  name: string
  age: string
  gender: string
  provisional_diagnosis: string
  opd_number: string,
  pain_L4_left: number,
  pain_L4_right: string,
  pain_C7_left: string,
  pain_C7_right: string,
  hot_sensation_L4_left: boolean,
  hot_sensation_L4_right: boolean,
  hot_sensation_C7_left: boolean,
  hot_sensation_C7_right: boolean,
  cold_sensation_L4_left: boolean,
  cold_sensation_L4_right: boolean,
  cold_sensation_C7_left: boolean,
  cold_sensation_C7_right: boolean,
  absoulte_tempature_L4_left: string,
  absoulte_tempature_L4_right: string,
  absoulte_tempature_C7_left: string,
  absoulte_tempature_C7_right: string,
  touch_L4_left: boolean,
  touch_L4_right: boolean,
  touch_C7_left: boolean,
  touch_C7_right: boolean,
  vibration_medial_malleolus_left: boolean,
  vibration_medial_malleolus_right: boolean,
  vibration_elbow_joint_left: boolean,
  vibration_elbow_joint_right: boolean,
}

export interface Notification {
  id?: string | null
  notificationSentTimestamp: Timestamp
  isNotificationRead: boolean
  notificationTitle: string
  notificationBody: string
  attemptUrl: string
}

// export all your collections
export const scenariosCol = createCollection<Scenario>('scenarios')
export const usersCol = createCollection<User>('users')
