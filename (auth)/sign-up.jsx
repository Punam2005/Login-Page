import * as React from 'react'
import { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View,Image } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import  {Styles}  from '../../assets/styles/auth.styles.js'
import Ionicons from '@expo/vector-icons/Ionicons'
import { COLORS } from '../../constant/colors.js'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
     if(err.errors?.[0]?.code === 'email_already_exists') {
        setError("Email already exists. Please try signing in.")
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace("/")
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <View style={Styles.verificationContainer}>
        <Text style={Styles.verificationTitle}>Verify your email</Text>
        {error ?(
          <View style={Styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={20} color={COLORS.expense} />
          <Text style={Styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => setError("")}>
            <Ionicons name="close" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>) 
        
        :null}
        <TextInput style={[Styles.verificationInput,error && Styles.errorInput]}
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor={"#9A8478"}
          onChangeText={(code) => setCode(code)}
        />
        <TouchableOpacity onPress={onVerifyPress} style={Styles.button}>
          <Text style={Styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    )
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
        <Text style={Styles.title}>Create Account</Text>
        {error ?(
          <View style={Styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={20} color={COLORS.expense} />
          <Text style={Styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => setError("")}>
            <Ionicons name="close" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>)  
        :null}
        <TextInput  style={[Styles.input, error && Styles.errorInput]}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
           placeholderTextColor={"#9A8478"}
          onChangeText={(email) => setEmailAddress(email)}
        />
        <TextInput style={[Styles.input, error && Styles.errorInput]}
          value={password}
          placeholder="Enter password"
           placeholderTextColor={"#9A8478"}
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity style={Styles.button} onPress={onSignUpPress}>
          <Text style={Styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <View style={Styles.footerContainer}>
          <Text style={Styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={Styles.linkText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}