type FetchRequest = {
  url: string
  options: object
}

export async function fetchAsync ({url, options}: FetchRequest): Promise<string> {
  return await fetch(url, options)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      
      return await response.blob()
    })
    .then(async (response) => {
      return await response.text()
    })
}