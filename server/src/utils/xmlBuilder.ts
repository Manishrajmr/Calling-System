export const generateVoiceXML = (message: string) => {
  return `
<Response>
  <Speak>${message}</Speak>
</Response>
`
}