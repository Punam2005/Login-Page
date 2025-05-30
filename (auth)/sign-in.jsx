import { useSignIn } from '@clerk/clerk-expo'
import { useState } from 'react'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View ,Image} from 'react-native'
import React from 'react'
import   {Styles}  from '../../assets/styles/auth.styles.js'
import Ionicons from '@expo/vector-icons/Ionicons'
import { COLORS } from '../../constant/colors'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = useState('')
  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      //console.error(JSON.stringify(err, null, 2))
      if (err.errors?.[0]?.code === 'invalid_identifier') {
        setError("Password or email is incorrect. Please try again.")
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    }
  }

  return (
    <KeyboardAwareScrollView
    style={{flex: 1}}
      contentContainerStyle={{ flexGrow: 1 }}
      enableAutomaticScroll={true}
      enableOnAndroid={true}>

      <View style={Styles.container}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={Styles.illustration}
        />
      <Text style={Styles.title}>Sign in</Text>
      {error ?(
          <View style={Styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={20} color={COLORS.expense} />
          <Text style={Styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => setError("")}>
            <Ionicons name="close" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>)  
        :null}
      <TextInput style={[Styles.input, error && Styles.errorInput]}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor={"#9A8478"}
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
      />
      <TextInput
        style={[Styles.input, error && Styles.errorInput]}
        value={password}
        placeholder="Enter password"
        placeholderTextColor={"#9A8478"}
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <TouchableOpacity style={Styles.button} onPress={onSignInPress}>
        <Text style={Styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <View style={Styles.footerContainer}>
        <Text style={Styles.footerText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/sign-up')}>
          <Text style={Styles.linkText}>Sign up</Text>
        </TouchableOpacity>
      </View>
      </View>
    </KeyboardAwareScrollView>
  )
}