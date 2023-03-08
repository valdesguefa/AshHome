# Create your views here.
from urllib import response
from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.response import Response

import numpy as np 
import pandas as pd
from rest_framework.views import APIView
from rest_framework.decorators import api_view
import pickle

from pathlib import Path
import sklearn as sk
import json
# from sklearn.externals import joblib
import sklearn.externals as extjoblib
import joblib

from selenium.common.exceptions import NoSuchElementException
from selenium import webdriver
from bs4 import BeautifulSoup
import time
import re
import os
from os import path
import urllib3
import random
import requests

from webdriver_manager.firefox import GeckoDriverManager
from random import choice
import threading
import queue

# Create your views here.



def scrapNearApartment(price, bedroom, bathroom, size, type):#, queue):
    #URL='https://www.propertyfinder.ae/en/search?af=500&am[]=AC&am[]=BA&am[]=BL&am[]=BR&am[]=BW&am[]=CO&am[]=CP&am[]=CS&am[]=MR&am[]=PA&am[]=PJ&am[]=PR&am[]=SP&am[]=SS&am[]=ST&am[]=SY&am[]=VW&am[]=WC&at=2000&bdr[]=1&btr[]=4&c=2&fu=1&kw=lobby_in_building%2Cprivate_garden%2Cprivate_gym%2Cprivate_pool%2Csecurity%2Cvastu_compliant&ob=nd&page=1&pf=20000&pt=200000&rp=y&t=1'

    #URL = "https://www.propertyfinder.ae/en/search?bdr[]=1&btr[]=3&c=2&fu=0&l=73&ob=nd&page=1&pf=20000&pt=70000&rp=y&t=1"
    URL = 'https://www.propertyfinder.ae/en/search?af=500&at='+str(size+200)+'&bdr[]='+str(bedroom)+'&btr[]='+str(bathroom)+'&c=2&fu=0&l=73&ob=nd&page=1&pf='+str(price-5000)+'&pt='+str(price+5000)+'&rp=y&t=1' if type=='rent' else 'https://www.propertyfinder.ae/en/search?af=500&at='+str(size+200)+'&bdr[]='+str(bedroom)+'&btr[]='+str(bathroom)+'&c=1&l=1&ob=mr&page=1&pf='+str(price+100000)+'&pt='+str(price+500000)+'&t=1#&rp=y'#"https://www.propertyfinder.ae/en/search?bdr[]=1&btr[]=3&c=2&fu=0&l=73&ob=nd&page=1&rp=y&t=1"
    # htmlText = requests.get(URL).text  
    # print(htmlText)
    # data=[]
    # soup=BeautifulSoup(htmlText, 'html.parser')
    # print(soup)
    browser = webdriver.Firefox(executable_path=GeckoDriverManager().install())
    browser.get(URL)
    prop_soup = BeautifulSoup(browser.page_source, 'html.parser')
    properties_cards = prop_soup.find_all('div', class_="card-list__item")
    properties = []
    i = 0

    for property_card in properties_cards:
        time.sleep(random.randint(5, 8))
        link = property_card.find('a')
        if link is not None:
            link = link.get('href')
            if link is not None:
                spec = []
                images = []
                if not 'https://www.propertyfinder.ae' in link:
                    link = 'https://www.propertyfinder.ae'+str(link)
                body = property_card.find('div', {'class': 'card__body'})
                body = body.find('div', {'class': 'card__image card__image--property card__image--gallery'})
                #if True:#not body is None:
                body = body.find('div', {'class': 'gallery gallery-scroll__gallery'})
                # body = body.find('div', {'class': 'whatsapp-nudge'})
                # body = body.find('picture', {'class': 'gallery__item '})
                
                # image = body.select('div.whatsapp-nudge source').get('srcset')
                # collect images of apartment
                if not body is None:
                    for e in body.select('div.whatsapp-nudge source'):
                        print(e.get('srcset'))
                        image = e.get('srcset')
                        images.append(image)
                # else:
                #     body = body.find('div', {'class': 'gallery-scroll '})
                #     # body = body.find('div', {'class': 'whatsapp-nudge'})
                #     # body = body.find('picture', {'class': 'gallery__item '})
                    
                #     # image = body.select('div.whatsapp-nudge source').get('srcset')
                #     # collect images of apartment
                #     if not body is None:
                #         for e in body.select('div.whatsapp-nudge source'):
                #             print(e.get('srcset'))
                #             image = e.get('srcset')
                #             images.append(image)
                    
                content = property_card.find('div', {'class': 'card__content'})
                
                # collect price and title of apartment
                body = content.find('div', {'class': 'card-intro'})
                body = body.find('div', {'class': 'card-intro__left'})
                price_area = body.find('div', {'class': 'card-intro__price-area'})
                
                price = price_area.find('p', {'class': 'card-intro__price'})
                price = price.getText()
                #print(price)
                
                title = content.find('h2', {'class': 'card-intro__title'})
                title = title.getText()
                #print(title)
                
                #collect specifications of apartement
                specification = content.find('div', {'class': 'card-specifications'})
                location = specification.find('p', {'class': 'card-specifications__location'})
                location = location.find('span', {'class': 'card-specifications__location-text'})
                location = location.getText()
                
                items = content.findAll('p', {'class': 'card-specifications__item'})
                
                for item in items:
                    print(item.getText())
                    spec.append(item.getText())
                
                properties.append({ 
                                    'link': link,
                                    'image':images,
                                    'price': price,
                                    'title':title,
                                    'location':location,
                                    'bedroom':spec[0],
                                    'bathrooms': spec[1],
                                    'area': spec[2]
                                    })
                
                
                # collect image of apartment
                
                    # print(e.get('srcset'))
                    
                # body = body.find('img', {'class': 'gallery__item  progressive-image--loaded'})
                
                # print(body)
            
        i = i+1
        if i == 18:
            return properties
    browser.close()
    #queue.put(properties)
    return properties


class Estimate(APIView):
    def post(self, request):
        input_json =  request.data#request.get_json(force=True)
        #print('that is input_json',input_json)
        #print('input_json',input_json) 
        #dictToReturn = {'text':input_json['text']}
        
        dt = pd.DataFrame({'latitude': input_json['latitude'],
                            'longitude': input_json['longitude'],
                            'size_in_sqft':  input_json['size_in_sqft'],
                            'no_of_bedrooms':  input_json['no_of_bedrooms'],
                            'no_of_bathrooms':  input_json['no_of_bathrooms'],
                            'partly_furnished': [1] if input_json['partly_furnished'] ==True else [0], 
                            'balcony': [1] if input_json['balcony'] ==True else [0],
                           'barbecue_area': [1] if input_json['barbecue_area'] ==True else [0],
                            'built_in_wardrobes': [1] if input_json['built_in_wardrobes'] ==True else [0],
                            'central_ac': [1] if input_json['central_ac'] ==True else [0],
                            'childrens_play_area': [1] if input_json['childrens_play_area'] ==True else [0],
                            'childrens_pool': [1] if input_json['childrens_pool'] ==True else [0],
                            'concierge': [1] if input_json['concierge'] ==True else [0],
                            'covered_parking': [1] if input_json['covered_parking'] ==True else [0],
                            'lobby_in_building': [1] if input_json['lobby_in_building'] ==True else [0],
                            'pets_allowed': [1] if input_json['pets_allowed'] ==True else [0],
                            'private_garden': [1] if input_json['private_garden'] ==True else [0],
                            'private_gym': [1] if input_json['private_gym'] ==True else [0],
                            'private_jacuzzi': [1] if input_json['private_jacuzzi'] ==True else [0],
                            'private_pool': [1] if input_json['private_pool'] ==True else [0],
                            'security': [1] if input_json['security'] ==True else [0],
                            'shared_gym': [1] if input_json['shared_gym'] ==True else [0],
                            'shared_pool': [1] if input_json['shared_pool'] ==True else [0],
                            'shared_spa': [1] if input_json['shared_spa'] ==True else [0],
                            'study': [1] if input_json['study'] ==True else [0],
                            'vastu_compliant': [1] if input_json['vastu_compliant'] ==True else [0],
                            'view_of_landmark': [1] if input_json['view_of_landmark'] ==True else [0],
                            'view_of_water': [1] if input_json['view_of_water'] ==True else [0],
                            'walk_in_closet': [1] if input_json['walk_in_closet'] ==True else [0],
                           'quality_High': [1] if input_json['quality_High'] ==True else [0],
                           'quality_Low': [1] if input_json['quality_Low'] ==True else [0],	
                           'quality_Medium': [1] if input_json['quality_Low'] ==True else [0],	
                           'quality_Ultra': [1] if input_json['quality_Ultra'] ==True else [0]
                            } )
      
        #dt = dt.fillna('')
        filename = Path(__file__).resolve().parent / 'XGBRegressor_buy_MAPEerrorTest_0.21418098213096257R2_test_0.8356207364967502.pkl'#'GradientBoostingRegressor2_buy.sav'
        print(input_json)
        #loaded_model = pickle.load(open(filename, 'rb'))
        # Load the saved model from disk
        loaded_model = joblib.load(filename)
        
        result1 = loaded_model.predict(dt)
        #result1 = result1*0.27 #+ 123000
        print(result1)
        
        filename = Path(__file__).resolve().parent / "GradientBoostingRegressor_rent_MAPEerrorTest_0.21505900367375236R2_test_0.6784504323481295.pkl"#'xgbr_regressor2_rent_0.76.sav'
        
        loaded_model = joblib.load(filename)#pickle.load(open(filename, 'rb'))
        result2 = loaded_model.predict(dt)
        #result2 = result2*0.27 #+ 123000
            
        #print('result',result1[0]) 
        #dt.head()
        result_1 = []
        result_2 = []
        result_1 = scrapNearApartment(result2[0], input_json['no_of_bedrooms'], input_json['no_of_bathrooms'],  input_json['size_in_sqft'], 'rent')

        time.sleep(5)
        result_2 = scrapNearApartment(result1[0], input_json['no_of_bedrooms'], input_json['no_of_bathrooms'],  input_json['size_in_sqft'], 'buy')
        
        # results_queue = queue.Queue()
        # thread_1 = threading.Thread(target=scrapNearApartment, args=(input_json['no_of_bedrooms'], input_json['no_of_bathrooms'],  input_json['size_in_sqft'], 'rent',results_queue,  ))
        # thread_2 = threading.Thread(target=scrapNearApartment, args=(input_json['no_of_bedrooms'], input_json['no_of_bathrooms'],  input_json['size_in_sqft'], 'buy',results_queue,  ))

        # # Démarrage des threads
        # thread_1.start()
        # thread_2.start()

        # # Attente de la fin des threads
        # thread_1.join()
        # thread_2.join()

        # # Récupération des résultats des fonctions
        # result1 = results_queue.get()
        # result2 = results_queue.get()

        #buy = scrapNearApartment(input_json['no_of_bedrooms'], input_json['no_of_bathrooms'],  input_json['size_in_sqft'], 'buy')
        res = {'vente': result1[0],
                         'vente_error':521000, #mean absolute error generate by model for buy price prediction 
                         'location_error': 40000,#mean absolute error generate by model for rent price prediction
                         'location': result2[0],
                         'apartmentRent': result_1,
                         'apartmentBuy': result_2
                         }
        print(res)
        return Response(res, status=status.HTTP_200_OK)
    @classmethod
    def get_extra_actions(cls):
        return []