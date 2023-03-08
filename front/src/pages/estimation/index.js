import 'antd/dist/antd.less';

import { Editor, Page } from 'components'
import { Button, message, Steps, Modal } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import './index.less';
import axios from 'axios';
import { Input, Tooltip, Checkbox, Divider, Tabs, Popover, Spin } from 'antd';
import { DollarCircleTwoTone, MinusCircleTwoTone, PlusCircleTwoTone, PlusCircleOutlined } from '@ant-design/icons';
import { valid } from 'mockjs';

import { AutoComplete } from 'antd';
import InputPlace from './InputPlace';
import CarouselComponent from './CarouselComponent';


const { Step } = Steps;
const URL = 'http://localhost:8000/estimation/';//'http://192.168.33.10:8000/estimation/';


const customDot = (dot, { status, index }) => (
  <Popover
    content={
      <span>
        step {index} status: {status}
      </span>
    }
  >
    {dot}
  </Popover>
);

//<Input prefix="￥" suffix="RMB" /> m²

const Estimation = () => {

  // const autoCompleteRef = useRef();
  // const inputRef = useRef();
  // const options = {
  //   componentRestrictions: { country: "ng" },
  //   fields: ["address_components", "geometry", "icon", "name"],
  //   types: ["establishment"]
  // };
  // useEffect(() => {
  //   autoCompleteRef.current = new window.google.maps.places.Autocomplete(
  //     inputRef.current,
  //     options
  //   );
  // }, []);

  const [current, setCurrent] = useState(0);
  const [location, setlocation] = useState('')
  const [position ,setposition] = useState(null)

  const [informations, setInformations] = useState(
    {
      "latitude": 25.09938,
      "longitude": 55.141275,
      "size_in_sqft": 745,
      "no_of_bedrooms": 1,
      "no_of_bathrooms": 1,
      "partly_furnished": false,
      "balcony": false,
      "barbecue_area": false,
      "built_in_wardrobes": false,
      "central_ac": false,
      "childrens_play_area": false,
      "childrens_pool": false,
      "concierge": false,
      "covered_parking": false,
      "lobby_in_building": false,
      "pets_allowed": false,
      "private_garden": false,
      "private_gym": false,
      "private_jacuzzi": false,
      "private_pool": false,
      "security": false,
      "shared_gym": false,
      "shared_pool": false,
      "shared_spa": false,
      "study": false,
      "vastu_compliant": false,
      "view_of_landmark": false,
      "view_of_water": false,
      "walk_in_closet": false,
      "quality_High": false,
      "quality_Low": false,
      "quality_Medium": false,
      "quality_Ultra": false
    }
  )



  const [steps, setSteps] = useState([
    {
      title: `surface ${informations.size_in_sqft} sqft`,
      content: 'Quelle est la surface de votre appartement ?',
    },
    {
      title: 'Second',
      content: 'Combien y a-t-il de chambre(s) et de salle(s) de bains dans votre appartement ?',
    },
    {
      title: 'thirst',
      content: 'Où se trouve votre appartement ?',
    },
    {
      title: 'qua',
      content: 'Caracteristiques de votre appartement',
    },
  ]);
  useEffect(() => {
    var a = parseFloat(informations.size_in_sqft)
    console.log('that is type of a', typeof (a));
    setSteps([
      {
        title: `surface ${a.toFixed(1)} sqft`,
        content: 'Quelle est la surface de votre appartement ?',
      },
      {
        title: `${informations.no_of_bedrooms} chambre(s) et ${informations.no_of_bathrooms} salle(s) de bains `,
        content: 'Combien y a-t-il de chambre(s) et de salle(s) de bains dans votre appartement ?',
      },
      {
        title: `latitude ${parseFloat(informations.latitude).toFixed(3)} et longitude ${parseFloat(informations.longitude).toFixed(3)}`,
        //content: 'À quelle latitude et longitude se trouve votre appartement ?',
        content: 'Où se trouve votre appartement ?',
      },
      {
        title: 'Caractéristiques',
        content: 'Caractéristiques de votre appartement',
      },
    ])
  }, [informations.size_in_sqft, informations.no_of_bedrooms, informations.no_of_bathrooms, informations.latitude, informations.longitude])

  useEffect(() => {
    console.log('that is informations', informations)
  }, [informations])

  useEffect(() => {
    console.log('that is location', location)
  }, [location])


  const [result, setresult] = useState(null)

  const submit = () => {

    axios.post(URL, informations, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        setresult(response.data)
        message.success('Processing complete!');
        console.log('that is response', response)
      }).catch(error => console.log(error))

  }

  const next = () => {
    setCurrent(current + 1);
    console.log(`that is value ${informations["quality_Medium"]}`)
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleReset = () => {
    setCurrent(0);
    setCheckedList([]);
    setInformations(
      {
        "latitude": 25.09938,
        "longitude": 55.141275,
        "size_in_sqft": 745,
        "no_of_bedrooms": 1,
        "no_of_bathrooms": 1,
        "partly_furnished": false,
        "balcony": false,
        "barbecue_area": false,
        "built_in_wardrobes": false,
        "central_ac": false,
        "childrens_play_area": false,
        "childrens_pool": false,
        "concierge": false,
        "covered_parking": false,
        "lobby_in_building": false,
        "pets_allowed": false,
        "private_garden": false,
        "private_gym": false,
        "private_jacuzzi": false,
        "private_pool": false,
        "security": false,
        "shared_gym": false,
        "shared_pool": false,
        "shared_spa": false,
        "study": false,
        "vastu_compliant": false,
        "view_of_landmark": false,
        "view_of_water": false,
        "walk_in_closet": false,
        "quality_High": false,
        "quality_Low": false,
        "quality_Medium": false,
        "quality_Ultra": false
      }
    )
  };



  const CheckboxGroup = Checkbox.Group;

  const [plainOptions, setplainOptions] = useState([
    'partly_furnished',
    'balcony',
    'barbecue_area', 'built_in_wardrobes',
    'central_ac', 'childrens_play_area', 'childrens_pool', 'concierge',
    'covered_parking', 'lobby_in_building', 'pets_allowed', 'private_garden',
    'private_gym', 'private_jacuzzi', 'private_pool', 'security', 'shared_gym',
    'shared_pool', 'shared_spa', 'study', 'vastu_compliant', 'view_of_landmark',
    'view_of_water', 'walk_in_closet'
  ])

  const [checkedList, setCheckedList] = useState([]);
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const [key, setkey] = useState(1)


  const onChange = (list) => {
    console.log('checked list', list)
    var val1 = Object.assign({}, informations);
    for (let obj of plainOptions) {
      console.log('(list.findIndex(obj)', (list.findIndex((elt) => elt === `${obj}`)))
      if (list.findIndex((elt) => elt === `${obj}`) !== -1) {
        val1[`${obj}`] = true
        // setInformations({ ...informations, obj: true })
      }
      else {
        val1[`${obj}`] = false
        // setInformations({ ...informations, obj: false })
      }
    }

    //  setInformations({ ...val1 })

    if ((list.length >= 0) && (list.length <= 7)) {
      val1 = ({ ...val1, 'quality_Low': true })
      val1 = ({ ...val1, 'quality_Medium': false })
      val1 = ({ ...val1, 'quality_High': false })
      val1 = ({ ...val1, 'quality_Ultra': false })
    }

    else if ((list.length >= 8) && (list.length <= 14)) {
      val1 = ({ ...val1, 'quality_Low': false })
      val1 = ({ ...val1, 'quality_Medium': true })
      val1 = ({ ...val1, 'quality_High': false })
      val1 = ({ ...val1, 'quality_Ultra': false })
    }
    else if ((list.length >= 15) && (list.length <= 21)) {
      val1 = ({ ...val1, 'quality_Low': false })
      val1 = ({ ...val1, 'quality_Medium': false })
      val1 = ({ ...val1, 'quality_High': true })
      val1 = ({ ...val1, 'quality_Ultra': false })
    }
    else if ((list.length >= 22) && (list.length <= 28)) {
      val1 = ({ ...val1, 'quality_Low': false })
      val1 = ({ ...val1, 'quality_Medium': false })
      val1 = ({ ...val1, 'quality_High': false })
      val1 = ({ ...val1, 'quality_Ultra': true })
    }

    setCheckedList(list);

    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
    console.log('that is val1', val1)

    setInformations({ ...val1 })
  };


  const onCheckAllChange = (e) => {
    console.log('all is checked', e.target.checked)
    var val = Object.assign({}, informations);
    val = ({ ...val, 'quality_Low': false })
    val = ({ ...val, 'quality_Medium': false })
    val = ({ ...val, 'quality_High': false })
    val = ({ ...val, 'quality_Ultra': false })
    //  console.log('plainOptions ', plainOptions)
    for (let obj1 of plainOptions) {
      console.log('iterate', plainOptions[0].toString())
      var j = `${obj1}`
      if (e.target.checked) {

        val[j] = true;
        // setInformations({ ...val})
        console.log('setInformations ', informations)
        val = ({ ...val, 'quality_Ultra': true })
      }
      else {
        val[j] = false;
        // setInformations({...val})
        val = ({ ...val, 'quality_Low': false })
        val = ({ ...val, 'quality_Medium': false })
        val = ({ ...val, 'quality_High': false })
        val = ({ ...val, 'quality_Ultra': false })
      }

    }
    setCheckedList(e.target.checked ? plainOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    setInformations({ ...val })
    console.log('val test', val)
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setresult(null)
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setresult(null)
    setIsModalOpen(false);
  };

  const goBack = (e) => {
    if (e < current) {
      setCurrent(e)
    }
  }

  function currencyFormatDE(num) {
    return (
      num
        .toFixed(0) // always two decimal digits
        .replace('.', ',') // replace decimal point character with ,
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') //+ ' €'
    ) // use . as a separator
  }

  return (
    <Page inner style={{ display: 'inline-flex', position: 'absolute' }}>


      <Modal
        centered={true}
        width={1000}

        style={{ height: '80%' }}
        open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>


        {
          result !== null ? <Tabs
            defaultActiveKey="1"
            onChange={(myKey) => setkey(myKey)}
            items={[
              {
                label: `Vente`,
                key: '1',
                children: <div><Steps current={3} >
                  <Step title={currencyFormatDE(result.vente - result.vente_error)} icon={<MinusCircleTwoTone />} status='finish' description='prix bas' />
                  {result.vente && <Step title={currencyFormatDE(result.vente)} icon={<DollarCircleTwoTone />} status='finish' description='prix net vendeur' />
                  }
                  <Step title={currencyFormatDE(result.vente + result.vente_error)} icon={<PlusCircleOutlined />} status='finish' description='prix haut' />
                </Steps>

                </div>

              },
              {
                label: `Location`,
                key: '2',
                children: <Steps current={3} >
                  <Step title={currencyFormatDE(result.location - result.location_error) + ' /an'} icon={<MinusCircleTwoTone />} status='finish' description='prix bas' />
                  {result.location && <Step title={currencyFormatDE(result.location) + ' /an'} icon={<DollarCircleTwoTone />} status='finish' description='prix net vendeur' />
                  }
                  <Step title={currencyFormatDE(result.location + result.location_error) + ' /an'} icon={<PlusCircleOutlined />} status='finish' description='prix haut' />
                </Steps>,
              },

            ]}
          /> : <Spin style={{ marginLeft: '40%', marginTop: '20px' }} tip='Loading...' />
        }


        {result !== null ? <>
          <Divider style={{ margin: '10px' }} />
          <span style={{ float: 'bottom' }}>prix en AED</span>
        </> : null}
           {
            result !== null ?
        <div style={{ backgroundColor:'red'}}>
          {
            key == "1" ?  <CarouselComponent data={result.apartmentBuy} /> :  <CarouselComponent data={result.apartmentRent} />
            /*      <CarouselComponent data={result.apartmentBuy.filter(elt => `${elt.location}`.trim().toLowerCase().includes(`${position}`.trim().toLowerCase()))}/>:
                  <CarouselComponent data={result.apartmentRent.filter(elt => `${elt.location}`.trim().toLowerCase().includes(`${position}`.trim().toLowerCase()))}/> */
          }


        </div> : null
        }

      </Modal>



      <div style={{ maxWidth: '100%', display: 'block' }}>
        <div style={{ float: 'right', overflow: 'scroll' }}>
          <Steps current={current} direction='vertical' >
            {steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
        </div>
        <div >
          <div className="steps-content">
            {steps[current].content}
            <br />
            {

              current === 0 &&
              <div>
                <br />
                <Input type='number' style={{ minWidth: '50px', maxWidth: '120px', borderColor: 'rgb(32, 28, 28)', }} size="large" suffix="sqft" value={informations["size_in_sqft"]} onChange={(event) => { setInformations({ ...informations, "size_in_sqft": parseFloat(event.target.value) }) }} />
              </div>
            }
            {
              current === 1 &&
              <div style={{ textAlign: 'center' }}>
                <br />
                <span>Combien y a-t-il de chambre(s) ?</span>
                <br />
                <Input type='number' min={0} style={{ minWidth: '50px', maxWidth: '100px', borderColor: 'rgb(32, 28, 28)', }} size="large" value={informations["no_of_bedrooms"]} onChange={(event) => { setInformations({ ...informations, "no_of_bedrooms": parseFloat(event.target.value) }) }} />
                <br />
                <br />
                <div >
                  <span >Combien y a-t-il de salle(s) de bains ?</span>
                  <br />
                  <Input type='number' min={0} style={{ minWidth: '50px', maxWidth: '100px', borderColor: 'rgb(32, 28, 28)', }} size="large" value={informations["no_of_bathrooms"]} onChange={(event) => { setInformations({ ...informations, "no_of_bathrooms": parseFloat(event.target.value) }) }} />

                </div>
              </div>
            }

            {
              current === 2 &&
              <>
                {/* <br />
              <span>À quelle latitude se trouve votre appartement ?</span>
              <br /> */}
                {/* <span>Où se trouve votre appartement ?</span> */}
                {/* <Input type='number' style={{ minWidth: '50px', maxWidth: '100px', borderColor: 'rgb(32, 28, 28)', }} size="large" value={informations["latitude"]} onChange={(event) => { setInformations({ ...informations, "latitude": parseFloat(event.target.value) }) }} /> */}

                <div>
                  {/* <AutoCompleteComponent /> */}
                  <InputPlace modifyLatitude={(value) => { setInformations({ ...informations, "latitude": parseFloat(value) }) }} modifyLongitude={(value) => { setInformations({ ...informations, "longitude": parseFloat(value) }) }} setposition={(text) => setlocation(text)}/>
                  {/* <InputPlace /> */}
                </div>
                {/*
              <br />
              <br />
              <div>
                <span>À quelle longitude se trouve votre appartement ?</span>
                <br />
                <Input type='number' style={{ minWidth: '50px', maxWidth: '100px', borderColor: 'rgb(32, 28, 28)', }} size="large" value={informations["longitude"]} onChange={(event) => { setInformations({ ...informations, "longitude": parseFloat(event.target.value) }) }} />
              </div> */}
              </>

            }

            {
              current === 3 &&
              <div style={{ marginTop: '30px' }}>
                <Checkbox style={{}} indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                  Check all
                </Checkbox>
                <hr style={{ backgroundColor: '#b9b9b9' }} />
                <CheckboxGroup value={checkedList} onChange={onChange} >
                  {/* <div style={{ overflow: 'overlay',height:'200px' }}>
                  <table>
                    <th></th>
                    {plainOptions.map(option =>
                      <div>
                        <tr> <td align='left'>
                          <Checkbox value={option}>{option}</Checkbox>
                        </td></tr>
                      </div>
                    )}
                  </table>
                </div> */}
                  <div style={{ flexWrap: 'wrap', height: '200px', display: 'flex' }}>
                    {plainOptions.map(option =>
                      <div key={option}>

                        <Checkbox value={option}>{option}</Checkbox>

                      </div>
                    )}
                  </div>
                </CheckboxGroup>
              </div>
            }

          </div>
          <div className="steps-action">
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <>
                <Button type="primary" onClick={() => {

                  showModal();
                  submit();

                }}>
                  Done
                </Button>

                <Button style={{ margin: '0 8px' }} onClick={() => handleReset()}>
                  Reset
                </Button>
              </>
            )}
            {current > 0 && (
              <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                Previous
              </Button>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
};

export default Estimation;
