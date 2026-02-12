"""
Test script to verify the dropout prediction model
"""

from dropout_predictor import DualScalingDropoutPredictor
import pandas as pd

def test_model():
    print("="*60)
    print("TESTING DROPOUT PREDICTION MODEL")
    print("="*60)
    
    # Load the trained model
    predictor = DualScalingDropoutPredictor()
    predictor.load_model('models/dropout_model.pkl')
    
    # Load sample data
    df = pd.read_csv('data.csv', sep=';')
    
    # Test with a few sample students
    print("\nTesting predictions on sample students:\n")
    
    for i in range(5):
        student = df.iloc[i].to_dict()
        actual = student['Target']
        
        prediction = predictor.predict(student)
        
        print(f"Student {i+1}:")
        print(f"  Actual: {actual}")
        print(f"  Predicted: {prediction['prediction']}")
        print(f"  Risk Level: {prediction['risk_level']}")
        print(f"  Dropout Probability: {prediction['dropout_probability']:.2%}")
        print(f"  Academic Risk: {prediction['academic_risk_score']:.2%}")
        print(f"  Socioeconomic Risk: {prediction['socioeconomic_risk_score']:.2%}")
        print()

if __name__ == "__main__":
    test_model()
