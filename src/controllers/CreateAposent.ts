import ProjectLife from "../models/ProjectLife"


export const CreateAposent = async (req, res) => {
      // const docId = process.env.ID_PLANILHA

      // const doc = new GoogleSpreadsheet(docId)

      // const response = await doc.useServiceAccountAuth(credentials, async () => {
      //   await doc.loadInfo()
      // })
      // console.log(response)
      
      const {yearsOldNow,retirement, applyMonth, patrimonyInit, yearsConstruct, lifeExpect,retirementeValue, projectedINSS , otherSources, taxYear,taxMonth} = req.body as any
      // console.log(yearsOldNow,retirement, applyMonth, patrimonyInit, yearsConstruct, lifeExpect,retirementeValue, projectedINSS , otherSources, taxYear,taxMonth, 'req.body')
      const {userId} = req as any
      // console.log(userId, 'user')

      var yearOld = Number(yearsOldNow)
      
      const patrimonyFormated = patrimonyInit.replaceAll('.', '')
      var montante = Number(patrimonyFormated.replace(',', '.')) // Valor Acumulado Atualmente
      var montanteInit = montante
      const applyMonthFormated = applyMonth.replaceAll('.', '')
      var ValueMonth = Number(applyMonthFormated.replace(',', '.')) //55.76 //Valor de aporte por mes

      var taxNumber = Number(taxYear)

      // const taxMonthFormated = taxMonth.replaceAll('.', '')
      var taxaM = taxMonth //Number(taxMonthFormated.replace(',', '.')) //0.95 // Taxa por mês
      
      const projectedINSSFormated = projectedINSS.replaceAll('.','')
      var INSSproject = Number(projectedINSSFormated.replace(',', '.'))

      const otherSourcesFormated = otherSources.replaceAll('.','')
      var otherSourcesFinal = Number(otherSourcesFormated.replace(',', '.'))

      const timeWork = yearsConstruct
      var tempoM = timeWork *12 // Meses de Criação de patrimonio
      var adicionado = 0

      var ValueApos = 0
      var ExpectLife = Number(lifeExpect)

      var RetireValueForm = retirementeValue.replaceAll('.', '')
      var RetireValue = Number(RetireValueForm.replace(',', '.'))
      var descontandoValue = Math.abs(RetireValue - INSSproject - otherSourcesFinal) //Valor a ser descontado para objetivo de aposentadoria
      var tempoApose = (ExpectLife - retirement) * 12 // meses de aposentadoria 65-90 anos 

      // console.log(yearsOldNow, retirement, lifeExpect, applyMonth, patrimonyInit, yearsConstruct, retirementeValue, projectedINSS , otherSources, taxYear, taxMonth, 'req.body')
      // console.log(yearOld, retirement, ExpectLife, ValueMonth, montante, RetireValue,tempoM, tempoApose, INSSproject, otherSourcesFinal, taxaM, taxNumber, 'formats' )

      var totalAmountInit = Number(((tempoM * ValueMonth) + montante).toFixed(2))

      var idade = 0
      var idadeMilion = 0
      var tenYears = 0

      function Montante(montante, taxaM, tempoM){
        montante = (montante +(montante * (taxaM / 100)))  //  * (1 + (taxaM / 100)) ** tempoM
        var txa = taxaM / 100

        montante = Number(montante.toFixed(2))
        return montante
      }


      for(var i = 0; i <= tempoM; i++){
        montante = montante + ValueMonth
        if(i !== 0){
          montante = Montante(montante, taxaM, tempoM)
        }
        idade = Number(((i/12)+yearOld).toFixed(2)) 
        //  console.log(idade, 'recem')
      
        if(tenYears === 0){
          if(i === 132) {
            tenYears = montante
          }
        }
        if(idadeMilion === 0 ){
          if(montante >= 1000000){
            idadeMilion = Number(idade)
          }
        }
      console.log( i, idade.toFixed(2) , montante, "Juros compostos com acumulado")
      }
      
      var amountRetire = montante
      var gainAmountInit = amountRetire - totalAmountInit

      for(var i = 0; i<= tempoApose; i++){
        montante = montante - descontandoValue
        montante = Montante(montante, taxaM, tempoM)
        var idade = (i/12)+65
        
        if(idade == 65.00){
          // console.log(idade)
          ValueApos = montante
        }
      console.log( idade.toFixed(2), montante, "Descontando Aposentadoria")
      }
      const tax = taxaM / 100
      const valuetotal = RetireValue / tax
      // console.log(valuetotal)
      
      // console.log(tax, 'tax')
      const resultCalc = tax / (1 -(1 / ((1 + tax)**tempoM)))
      // console.log(resultCalc, 'Correct tax')
      const correctTop = valuetotal * resultCalc

      const PortionMin = Number((correctTop - RetireValue).toFixed(2))
      // console.log(PortionMin, 'Parcela')

      const PortionNegative = Number((PortionMin - (PortionMin * 0.0804)).toFixed(2))
      // console.log(PortionNegative, 'parcela negativa')

      const PercentGainTenYears = (tenYears * 100)/ (montanteInit === 0 ? 1 : montanteInit)
      // console.log(PercentGainTenYears, 'PercentGainTenYears')

      const PercentGainFees = ( gainAmountInit * 100)/ (montanteInit === 0 ? 1 : montanteInit)
      console.log(PercentGainFees, 'PercentGainFees')

      const PercentGainRetirement = ( ValueApos * 100)/ (montanteInit === 0 ? 1 : montanteInit)
      console.log(PercentGainRetirement, 'PercentGainRetirement')

      const PercentProjectPatrimony = ( montante * 100)/ (montanteInit === 0 ? 1 : montanteInit)
      console.log(PercentProjectPatrimony, 'PercentProjectPatrimony')



      const data = {
        yearOld, retirement, ExpectLife, ValueMonth, 
        montanteInit,  RetireValue,tempoM, tempoApose, 
        INSSproject, otherSourcesFinal, taxaM, taxNumber,
        montante, ValueApos ,idadeMilion, totalAmountInit, 
        gainAmountInit, tenYears, PortionMin, PortionNegative,
        PercentGainTenYears, PercentGainFees,PercentGainRetirement,
        PercentProjectPatrimony,
        user: userId
      }
      const Retirement = await ProjectLife.create(data)
      // console.log('idadeAtual',yearOld, 'idade aposentado', retirement, 'expectativa', ExpectLife, 'valor por mes', ValueMonth, 'Montante inicial', montanteInit, 'retirado na aposentadoria', RetireValue,'tempo de produçao',tempoM, 'tempo de aposentadoria',tempoApose, 'valor inss', INSSproject, 'outras fontes', otherSourcesFinal, 'taxa mensal', taxaM, 'taxa anual', taxNumber, 'montante final calculo', montante, 'montante no ano de aposentado', ValueApos , 'idade 1 milhão', idadeMilion, 'total guardado sem juros',  totalAmountInit,gainAmountInit, 'montante em 10 anos',tenYears, 'parcela Boa', PortionMin, 'Parcela ruim', PortionNegative, 'Salvar no banco' )  

      return res.json({montante, ValueApos , idadeMilion, totalAmountInit,gainAmountInit, tenYears, PortionMin, PortionNegative })
    }