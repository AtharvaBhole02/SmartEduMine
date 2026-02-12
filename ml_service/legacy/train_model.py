"""
Script to train the dual scaling dropout prediction model
Run this first to train the model before starting the API server
"""

from dropout_predictor import DualScalingDropoutPredictor
import os

def main():
    print("="*60)
    print("DUAL SCALING DROPOUT PREDICTION MODEL - TRAINING")
    print("="*60)
    
    # Create models directory if it doesn't exist
    os.makedirs('models', exist_ok=True)
    
    # Initialize predictor
    predictor = DualScalingDropoutPredictor()
    
    # Load data
    print("\nLoading data from data.csv...")
    df = predictor.load_data('data.csv')
    
    print(f"\nDataset Information:")
    print(f"  Total Records: {len(df)}")
    print(f"  Features: {len(df.columns)}")
    print(f"\nTarget Distribution:")
    print(df['Target'].value_counts())
    print(f"\nPercentages:")
    print(df['Target'].value_counts(normalize=True) * 100)
    
    # Train the model
    print("\n" + "="*60)
    results = predictor.train(df)
    
    # Save the model
    predictor.save_model('models/dropout_model.pkl')
    
    print("\n" + "="*60)
    print("TRAINING SUMMARY")
    print("="*60)
    print(f"Academic Model Accuracy: {results['academic_accuracy']:.2%}")
    print(f"Socioeconomic Model Accuracy: {results['socioeconomic_accuracy']:.2%}")
    print(f"Ensemble Model Accuracy: {results['ensemble_accuracy']:.2%}")
    print("\nTop 5 Academic Features:")
    academic_features = sorted(
        predictor.feature_importance['academic'].items(),
        key=lambda x: x[1],
        reverse=True
    )[:5]
    for feature, importance in academic_features:
        print(f"  {feature}: {importance:.4f}")
    
    print("\nTop 5 Socioeconomic Features:")
    socio_features = sorted(
        predictor.feature_importance['socioeconomic'].items(),
        key=lambda x: x[1],
        reverse=True
    )[:5]
    for feature, importance in socio_features:
        print(f"  {feature}: {importance:.4f}")
    
    print("\n" + "="*60)
    print("Model training complete! You can now start the API server.")
    print("Run: python api_server.py")
    print("="*60)

if __name__ == "__main__":
    main()
