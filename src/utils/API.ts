export default class API {
  private _apiUrl: string = 'http://127.0.0.1:5000'

  public get apiUrl() {
    return this._apiUrl
  }

  async getData(url: string) {
    // const headers = {
    //   'Content-Type': 'application/json'
    // }

    const response = await fetch(url, {
      method: 'GET'
      // headers
    })
    const responseJson = await response.json()
    // console.log(responseJson)
    return responseJson
  }

  // async postData(url: string, datas?: any, token?: string | null, isMultipart?: boolean | null) {
  //   let response = null
  //   if (isMultipart) {
  //     response = await fetch(url, {
  //       method: 'POST',
  //       headers: {
  //         // "Content-Type": "multipart/form-data",
  //         Authorization: token ? 'Bearer ' + token : ''
  //       },
  //       body: datas
  //     })
  //   } else {
  //     response = await fetch(url, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: token ? 'Bearer ' + token : ''
  //       },
  //       body: datas
  //     })
  //   }
  //   const responseJson = await response.json()
  //   console.log(responseJson)
  //   return responseJson
  // }

  // async putData(url: string, datas: any, token: string | null) {
  //   const response = await fetch(url, {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: token ? 'Bearer ' + token : ''
  //     },
  //     body: datas
  //   })
  //   const responseJson = await response.json()
  //   console.log(responseJson)
  //   return responseJson
  // }

  // async deleteData(url: string, datas: any, token: string | null) {
  //   const response = await fetch(url, {
  //     method: 'DELETE',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: token ? 'Bearer ' + token : ''
  //     },
  //     body: datas
  //   })
  //   const responseJson = await response.json()
  //   console.log(responseJson)
  //   return responseJson
  // }
}
